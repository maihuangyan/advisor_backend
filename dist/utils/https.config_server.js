"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsOptions = void 0;
var fs = require("fs");
exports.httpsOptions = {
    key: fs.readFileSync("/opt/lampp/etc/ssl.key/server.key"),
    cert: fs.readFileSync("/opt/lampp/etc/ssl.crt/server.crt"),
};
//# sourceMappingURL=https.config_server.js.map