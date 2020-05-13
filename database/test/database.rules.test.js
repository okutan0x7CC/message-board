/*
 * - 概要
 *      Firebase Realtime Database のセキュリティルールに使われる database.rules.json をテストする
 * - 実行コマンド
 *      `npm run test`
 * - 補足
 *      admin とは AdminSDK を使用するユーザーではなく、email のドメインが管理者所有となっているユーザーである
 * - 参考 : Realtime Database emulator quickstart
 *      https://github.com/firebase/quickstart-nodejs/tree/master/database-emulator/javascript-quickstart
 */

const firebase = require("@firebase/testing");
const fs = require("fs");
const moment = require("moment");

// init env variables
require("dotenv").config();
let admin_emails = [];
if (process.env.ADMIN_EMAILS_FOR_TESTING !== undefined) {
    admin_emails = process.env.ADMIN_EMAILS_FOR_TESTING.split(",").map((e) =>
        e.trim()
    );
}

/*
 * ============
 *    Setup
 * ============
 */
const databaseName = "database-test";
const coverageUrl = `http://localhost:9000/.inspect/coverage?ns=${databaseName}`;

const rules = fs.readFileSync("database.rules.json", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
    return firebase.initializeTestApp({ databaseName, auth }).database();
}

/**
 * Creates a new admin app.
 *
 * @return {object} the app.
 */
function adminApp() {
    return firebase.initializeAdminApp({ databaseName }).database();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async () => {
    // Set database rules before running these tests
    await firebase.loadDatabaseRules({
        databaseName,
        rules: rules,
    });
});

beforeEach(async () => {
    // Clear the database between tests
    await adminApp().ref().set(null);
});

after(async () => {
    // Close any open apps
    await Promise.all(firebase.apps().map((app) => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe("room", () => {
    it("cannot be created by user", async () => {
        const alice = authedApp({ uid: "user_id_1", email: "alice@alice.com" });
        await firebase.assertFails(
            alice.ref("rooms/new_room").set({ title: "new_room_title" })
        );
    });

    it("cannot be deleted by user", async () => {
        await adminApp().ref("rooms/delete_target_room").set({
            title: "delete_target_room_title",
        });
        const alice = authedApp({ uid: "alice", email: "alice@alice.com" });
        await firebase.assertFails(
            alice.ref("rooms/delete_target_room").remove()
        );
    });

    it("cannot be updated by user", async () => {
        await adminApp().ref("rooms/update_target_room").set({
            title: "update_target_room_title",
        });
        const alice = authedApp({ uid: "alice", email: "alice@alice.com" });
        await firebase.assertFails(
            alice.ref("rooms").update({
                update_target_room: {
                    title: "updated",
                },
            })
        );
    });

    it("cannot be fetched by user in not public", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                before_public: {
                    title: "before_public_title",
                    public_start_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
                after_public: {
                    title: "after_public_title",
                    public_end_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                },
                not_set_public: {
                    title: "not_set_public_title",
                },
            });

        const alice = authedApp({ uid: "alice", email: "alice@alice.com" });
        await firebase.assertFails(
            alice.ref("rooms/before_public").once("value")
        );
        await firebase.assertFails(
            alice.ref("rooms/after_public").once("value")
        );
        await firebase.assertFails(
            alice.ref("rooms/not_set_public").once("value")
        );
    });

    it("can be fetched by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms/in_public")
            .set({
                title: "in_public_title",
                public_start_unixtime: moment(now_unixtime)
                    .subtract(2, "minutes")
                    .valueOf(),
                public_end_unixtime: moment(now_unixtime)
                    .add(2, "minutes")
                    .valueOf(),
            });

        const alice = authedApp({ uid: "alice", email: "alice@alice.com" });
        await firebase.assertSucceeds(
            alice.ref("rooms/in_public").once("value")
        );
    });

    it("cannot be created by admin without title", async () => {
        for (const [i, email] of admin_emails.entries()) {
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertFails(
                admin.ref(`rooms/email_${i}`).set({
                    title: "",
                })
            );
        }
    });

    it("can be created by admin", async () => {
        for (const [i, email] of admin_emails.entries()) {
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).set({
                    title: "admin",
                })
            );
        }
    });

    it("can be deleted by admin", async () => {
        for (const [i, email] of admin_emails.entries()) {
            await adminApp().ref(`rooms/email_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).remove()
            );
        }
    });

    it("can be updated by admin", async () => {
        for (const [i, email] of admin_emails.entries()) {
            await adminApp().ref(`rooms/email_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).update({
                    title: "updated",
                })
            );
        }
    });

    it("can be fetched by admin", async () => {
        for (const [i, email] of admin_emails.entries()) {
            await adminApp().ref(`rooms/email_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).once("value")
            );
        }
    });

    it("can be fetched by admin in not public", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        for (const [i, email] of admin_emails.entries()) {
            await adminApp()
                .ref(`rooms/email_${i}`)
                .set({
                    title: "admin",
                    public_start_unixtime: moment(now_unixtime)
                        .add(5, "minutes")
                        .valueOf(),
                });
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).once("value")
            );
        }
    });
});

describe("message", () => {
    it("cannot be created by user in not postable", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                before_postable: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
                after_postable: {
                    title: "title",
                    post_end_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                },
                not_set_postable: {
                    title: "title",
                },
            });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("messages/before_postable/message_1").set({
                user_id: "alice",
                nickname: "alice_nickname",
                text: "message_1_text",
                timestamp: now_unixtime,
            })
        );
        await firebase.assertFails(
            alice.ref("messages/after_postable/message_1").set({
                user_id: "alice",
                nickname: "alice_nickname",
                text: "message_1_text",
                timestamp: now_unixtime,
            })
        );
        await firebase.assertFails(
            alice.ref("messages/not_set_postable/message_1").set({
                user_id: "alice",
                nickname: "alice_nickname",
                text: "message_1_text",
                timestamp: now_unixtime,
            })
        );
    });

    it("cannot be deleted by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        await adminApp().ref("messages/room_id_1/message_1").set({
            user_id: "alice",
            nickname: "alice_nickname",
            text: "message_1_text",
            timestamp: now_unixtime,
        });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("rooms/room_id_1/message_1").remove()
        );
    });

    it("cannot be updated by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        await adminApp().ref("messages/room_id_1/message_1").set({
            user_id: "alice",
            nickname: "alice_nickname",
            text: "message_1_text",
            timestamp: now_unixtime,
        });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("messages/room_id_1").update({
                message_1: {
                    user_id: "alice",
                    nickname: "alice_nickname",
                    text: "updated",
                    timestamp: now_unixtime,
                },
            })
        );
    });

    it("cannot be created by user without required params", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({})
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
            })
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
            })
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "alice_nickname",
            })
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "alice_nickname",
                timestamp: now_unixtime,
            })
        );
    });

    it("cannot be created by user with invalid params", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "",
                nickname: "alice_nickname",
                timestamp: now_unixtime,
            })
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "alice_nickname",
                timestamp: moment(now_unixtime)
                    .add(2, "minutes") // future
                    .valueOf(),
            })
        );
    });

    it("cannot be created by user who not match auth claim", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "not_alice",
                text: "message_1_text",
                nickname: "alice_nickname",
                timestamp: now_unixtime,
            })
        );
        await firebase.assertFails(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "not_alice_nickname",
                timestamp: now_unixtime,
            })
        );
    });

    it("cannot be created by user when room does not exist", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("messages/not_exist/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "alice_nickname",
                timestamp: now_unixtime,
            })
        );
    });

    it("can be fetched by user when not public", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                before_public: {
                    title: "title",
                    public_start_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                    public_end_unixtime: moment(now_unixtime)
                        .add(4, "minutes")
                        .valueOf(),
                },
                after_public: {
                    title: "title",
                    public_start_unixtime: moment(now_unixtime)
                        .subtract(4, "minutes")
                        .valueOf(),
                    public_end_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                },
                not_set_public: {
                    title: "title",
                },
            });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("messages/before_public").once("value")
        );
        await firebase.assertFails(
            alice.ref("messages/after_public").once("value")
        );
        await firebase.assertFails(
            alice.ref("messages/not_set_public").once("value")
        );
    });

    it("can be fetched by user when not public", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    public_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    public_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertSucceeds(
            alice.ref("messages/room_id_1").once("value")
        );
    });

    it("can be created by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    public_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    public_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertSucceeds(
            alice.ref("messages/room_id_1/message_1").set({
                user_id: "alice",
                text: "message_1_text",
                nickname: "alice_nickname",
                timestamp: now_unixtime,
            })
        );
    });
});

describe("reaction", () => {
    it("cannot be created by user in not postable", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp().ref("messages/room_id_1/message_1").set({
            user_id: "bob",
            text: "message_1_text",
            nickname: "bob_nickname",
            timestamp: now_unixtime,
        });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_1").set({
                alice: true,
            })
        );
    });

    it("cannot be created by user who not match auth.id", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp().ref("messages/room_id_1/message_id_1").set({
            user_id: "bob",
            text: "message_1_text",
            nickname: "bob_nickname",
            timestamp: now_unixtime,
        });
        adminApp().ref("reactions/room_id_1/message_id_1").set({
            carol: true,
        });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_1").set({
                not_alice: true,
            })
        );
    });

    it("cannot be deleted by user who not match auth.id", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp().ref("messages/room_id_1/message_id_1").set({
            user_id: "bob",
            text: "message_1_text",
            nickname: "bob_nickname",
            timestamp: now_unixtime,
        });
        adminApp().ref("reactions/room_id_1/message_id_1").set({
            carol: true,
        });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_1/carol").set(null)
        );
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_1/carol").remove()
        );
    });

    it("cannot be created by user when message does not exist", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp()
            .ref("messages/room_id_1")
            .set({
                message_id_1: {
                    user_id: "bob",
                    text: "message_1_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
            });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/not_exist/alice").set(true)
        );
    });

    it("cannot be created by user when set value is not true", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp()
            .ref("messages/room_id_1")
            .set({
                message_id_1: {
                    user_id: "bob",
                    text: "message_1_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
                message_id_2: {
                    user_id: "bob",
                    text: "message_2_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
            });
        adminApp().ref("reactions/room_id_1/message_id_1/carol").set(true);
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_1/alice").set(false)
        );
        await firebase.assertFails(
            alice.ref("reactions/room_id_1/message_id_2/alice").set(false)
        );
    });

    it("can be created by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp()
            .ref("messages/room_id_1")
            .set({
                message_id_1: {
                    user_id: "bob",
                    text: "message_1_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
                message_id_2: {
                    user_id: "bob",
                    text: "message_2_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
            });
        adminApp().ref("reactions/room_id_1/message_id_1/carol").set(true);
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertSucceeds(
            alice.ref("reactions/room_id_1/message_id_1/alice").set(true)
        );
        await firebase.assertSucceeds(
            alice.ref("reactions/room_id_1/message_id_2/alice").set(true)
        );
    });

    it("can be deleted by user", async () => {
        const now_unixtime = firebase.firestore.Timestamp.now().toMillis();
        await adminApp()
            .ref("rooms")
            .set({
                room_id_1: {
                    title: "title",
                    post_start_unixtime: moment(now_unixtime)
                        .subtract(2, "minutes")
                        .valueOf(),
                    post_end_unixtime: moment(now_unixtime)
                        .add(2, "minutes")
                        .valueOf(),
                },
            });
        adminApp()
            .ref("messages/room_id_1")
            .set({
                message_id_1: {
                    user_id: "bob",
                    text: "message_1_text",
                    nickname: "bob_nickname",
                    timestamp: now_unixtime,
                },
            });
        adminApp().ref("reactions/room_id_1/message_id_1").set({
            carol: true,
            alice: true,
        });
        const alice = authedApp({ uid: "alice", nickname: "alice_nickname" });
        await firebase.assertSucceeds(
            alice.ref("reactions/room_id_1/message_id_1/alice").set(null)
        );
        await firebase.assertSucceeds(
            alice.ref("reactions/room_id_1/message_id_1/alice").remove()
        );
    });
});
