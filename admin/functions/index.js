const functions = require("firebase-functions");
const fs = require("fs");

exports.adminIndexHtml = functions.https.onRequest((req, res) => {
    const allowed_ips = [functions.config().admin.allowed_ip];
    const client_ip = req.headers["fastly-temp-xff"]
        .split(",")
        .pop()
        .trim();
    const is_allowed = allowed_ips.indexOf(client_ip) !== -1;
    let html = "";
    let status = 0;
    if (is_allowed) {
        html = fs.readFileSync("./admin/index.html").toString();
        status = 200;
    } else {
        html = "";
        status = 403;
    }
    res.status(status).send(html);
});
