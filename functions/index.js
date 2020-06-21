const functions = require("firebase-functions");
const fs = require("fs");

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
