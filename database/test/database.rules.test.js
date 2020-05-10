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
const admin_emails = process.env.ADMIN_EMAILS.split(",").map((e) => e.trim());
const admin_email_domains = process.env.ADMIN_EMAIL_DOMAINS.split(
    ","
).map((e) => e.trim());

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
        const alice = authedApp({ uid: "user_id_1" });
        await firebase.assertFails(
            alice.ref("rooms/new_room").set({ title: "new_room_title" })
        );
    });

    it("cannot be deleted by user", async () => {
        await adminApp().ref("rooms/delete_target_room").set({
            title: "delete_target_room_title",
        });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("rooms/delete_target_room").remove()
        );
    });

    it("cannot be updated by user", async () => {
        await adminApp().ref("rooms/update_target_room").set({
            title: "update_target_room_title",
        });
        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("rooms").update({
                update_target_room: {
                    title: "updated",
                },
            })
        );
    });

    it("cannot be fetched by user in not public", async () => {
        const date = firebase.firestore.Timestamp.now().toDate();
        await adminApp()
            .ref("rooms")
            .set({
                before_public: {
                    title: "before_public_title",
                    public_start_datetime: moment(date)
                        .add(2, "minutes")
                        .format("YYYY-MM-DD hh:mm:ss"),
                },
                after_public: {
                    title: "after_public_title",
                    public_end_datetime: moment(date)
                        .subtract(2, "minutes")
                        .format("YYYY-MM-DD hh:mm:ss"),
                },
            });

        const alice = authedApp({ uid: "alice" });
        await firebase.assertFails(
            alice.ref("rooms/before_public").once("value")
        );
        await firebase.assertFails(
            alice.ref("rooms/after_public").once("value")
        );
    });

    it("can be fetched by user", async () => {
        const date = firebase.firestore.Timestamp.now().toDate();
        await adminApp()
            .ref("rooms/in_public")
            .set({
                title: "in_public_title",
                public_start_datetime: moment(date)
                    .subtract(2, "minutes")
                    .format("YYYY-MM-DD hh:mm:ss"),
                public_end_datetime: moment(date)
                    .add(2, "minutes")
                    .format("YYYY-MM-DD hh:mm:ss"),
            });

        const alice = authedApp({ uid: "alice" });
        await firebase.assertSucceeds(
            alice.ref("rooms/in_public").once("value")
        );
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

        for (const [i, email_domain] of admin_email_domains.entries()) {
            const admin = authedApp({
                uid: "admin",
                email: `xxx@${email_domain}`,
            });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_domain_${i}`).set({
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

        for (const [i, email_domain] of admin_email_domains.entries()) {
            await adminApp().ref(`rooms/email_domain_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({
                uid: "admin",
                email: `xxx@${email_domain}`,
            });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_domain_${i}`).remove()
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

        for (const [i, email_domain] of admin_email_domains.entries()) {
            await adminApp().ref(`rooms/email_domain_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({
                uid: "admin",
                email: `xxx@${email_domain}`,
            });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_domain_${i}`).update({
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

        for (const [i, email_domain] of admin_email_domains.entries()) {
            await adminApp().ref(`rooms/email_domain_${i}`).set({
                title: "admin",
            });
            const admin = authedApp({
                uid: "admin",
                email: `xxx@${email_domain}`,
            });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_domain_${i}`).once("value")
            );
        }
    });

    it("can be fetched by admin in not public", async () => {
        const date = firebase.firestore.Timestamp.now().toDate();
        for (const [i, email] of admin_emails.entries()) {
            await adminApp()
                .ref(`rooms/email_${i}`)
                .set({
                    title: "admin",
                    public_start_datetime: moment(date)
                        .add(5, "minutes")
                        .format("YYYY-MM-DD hh:mm:ss"),
                });
            const admin = authedApp({ uid: "admin", email: email });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_${i}`).once("value")
            );
        }

        for (const [i, email_domain] of admin_email_domains.entries()) {
            await adminApp()
                .ref(`rooms/email_domain_${i}`)
                .set({
                    title: "admin",
                    public_start_datetime: moment(date)
                        .add(5, "minutes")
                        .format("YYYY-MM-DD hh:mm:ss"),
                });
            const admin = authedApp({
                uid: "admin",
                email: `xxx@${email_domain}`,
            });
            await firebase.assertSucceeds(
                admin.ref(`rooms/email_domain_${i}`).once("value")
            );
        }
    });
});

describe("message", () => {
    it("cannot be deleted by user", async () => {});

    it("cannot be updated by user", async () => {});

    it("cannot be created by user in not postable", async () => {});

    it("cannot be created by user without text", async () => {});

    it("cannot be created by user without nickname", async () => {});

    it("cannot be created by user without timestamp", async () => {});

    it("cannot be created by user without user_id", async () => {});

    it("cannot be created by user who not match auth.id", async () => {});

    it("can be created by user", async () => {});

    it("can be fetched by user", async () => {});

    it("can be created by admin", async () => {});

    it("can be deleted by admin", async () => {});

    it("can be updated by admin", async () => {});

    it("can be fetched by admin", async () => {});
});

describe("reaction", () => {
    it("cannot be created by user who not match auth.id", async () => {});

    it("cannot be deleted by user who not match auth.id", async () => {});

    it("cannot be created by user in not postable", async () => {});

    it("can be created by user", async () => {});

    it("can be deleted by user", async () => {});
});
