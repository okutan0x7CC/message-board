const firebase = require("@firebase/testing");
const fs = require("fs");

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
    it("cannot be created by user", async () => {});
    it("cannot be deleted by user", async () => {});
    it("cannot be updated by user", async () => {});
    it("cannot be fetched by user in not public", async () => {});
    it("can be fetched by user", async () => {});

    it("can be created by admin", async () => {});
    it("can be deleted by admin", async () => {});
    it("can be updated by admin", async () => {});
    it("can be fetched by admin", async () => {});
    it("can be fetched by admin in not public", async () => {});
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
