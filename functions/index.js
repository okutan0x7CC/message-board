const functions = require("firebase-functions");
const fs = require("fs");

const admin = require("firebase-admin");
admin.initializeApp();

exports.adminIndexHtml = functions.https.onRequest((req, res) => {
  const allowed_ips = functions
    .config()
    .functions.allowed_ips.split(",")
    .map((ip) => ip.trim());
  const client_ip = req.headers["fastly-temp-xff"].split(",").pop().trim();
  const is_allowed = allowed_ips.indexOf(client_ip) !== -1;
  let html = "";
  let status = 0;
  if (is_allowed) {
    html = fs
      .readFileSync(`./admin/${functions.config().functions.env}/index.html`)
      .toString();
    status = 200;
  } else {
    html = "";
    status = 403;
  }
  res.status(status).send(html);
});

exports.stgClientIndexHtml = functions.https.onRequest((req, res) => {
  const allowed_ips = functions
    .config()
    .functions.allowed_ips.split(",")
    .map((ip) => ip.trim());
  const client_ip = req.headers["fastly-temp-xff"].split(",").pop().trim();
  const is_allowed = allowed_ips.indexOf(client_ip) !== -1;
  let html = "";
  let status = 0;
  if (is_allowed) {
    html = fs
      .readFileSync(`./client/${functions.config().functions.env}/index.html`)
      .toString();
    status = 200;
  } else {
    html = "";
    status = 403;
  }
  res.status(status).send(html);
});

exports.deleteAdminAccount = functions.https.onCall(async (data, context) => {
  if (
    context.auth.token.email === null ||
    data.delete_user_email === undefined
  ) {
    return { ok: false };
  }

  const db = admin.database();
  const auth = admin.auth();

  // verify authority
  const has_authority = await db
    .ref(
      `admin_accounts/${context.auth.token.email.replace(
        /\./g,
        "%2E"
      )}/can_manage_account`
    )
    .once("value");
  if (!has_authority.val()) {
    return { ok: false };
  }

  // delete user
  const delete_user = await auth.getUserByEmail(data.delete_user_email);
  const delete_from_auth = auth.deleteUser(delete_user.uid);
  const delete_from_db = db
    .ref(`admin_accounts/${delete_user.email.replace(/\./g, "%2E")}`)
    .remove();
  Promise.all([delete_from_auth, delete_from_db])
    .then(() => {
      return { ok: true };
    })
    .catch(() => {
      return { ok: false };
    });
});

exports.autoCreateAdminAccount = functions.auth.user().onCreate((user) => {
  if (user.email === undefined) {
    admin.auth().deleteUser(user.uid);
    return;
  }

  admin
    .database()
    .ref(`admin_accounts/${user.email.replace(/\./g, "%2E")}`)
    .set({
      can_read: false,
      can_write: false,
      can_manage_account: false,
    });
});
