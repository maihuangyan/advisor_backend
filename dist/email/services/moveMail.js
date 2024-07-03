"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveMail = void 0;
const imapflow_1 = require("imapflow");
const config_local_1 = require("../../utils/config_local");
async function moveMail(email, srcPath, destPath, uid) {
    config_local_1.imapConfig.auth.user = email;
    const client = new imapflow_1.ImapFlow(config_local_1.imapConfig);
    await client.connect();
    const lock = await client.getMailboxLock(srcPath);
    try {
        const result = await client.messageMove(uid, destPath, { uid: true });
        console.log("move result:", result);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        lock.release();
        await client.logout();
    }
}
exports.moveMail = moveMail;
//# sourceMappingURL=moveMail.js.map