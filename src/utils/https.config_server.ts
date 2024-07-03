var fs = require("fs");

export const httpsOptions = {
  key: fs.readFileSync("/opt/lampp/etc/ssl.key/server.key"),
  cert: fs.readFileSync("/opt/lampp/etc/ssl.crt/server.crt"),
};
