"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMail = void 0;
const imapflow_1 = require("imapflow");
const mailparser_1 = __importDefault(require("mailparser"));
const config_local_1 = require("../../utils/config_local");
const simpleParser = mailparser_1.default.simpleParser;
async function fetchMail(email, path, count) {
    var e_1, _a;
    config_local_1.imapConfig.auth.user = email;
    console.log('fetch config - ', config_local_1.imapConfig);
    const client = new imapflow_1.ImapFlow(config_local_1.imapConfig);
    const messageArray = [];
    await client.connect();
    const lock = await client.getMailboxLock(path);
    try {
        await client.mailboxOpen(path);
        const status = await client.status(path, { unseen: true, messages: true });
        const messageCount = status.messages;
        if (count > messageCount - 1) {
            return messageArray;
        }
        const startIndex = count + 1;
        const endIndex = messageCount;
        const options = {
            envelope: true,
            source: true,
            flags: true,
            status: true,
            labels: true,
            uid: true,
            new: true,
        };
        try {
            for (var _b = __asyncValues(client.fetch(`${startIndex}:${endIndex}`, options)), _c; _c = await _b.next(), !_c.done;) {
                const msg = _c.value;
                const obj = {
                    flags: null,
                    envelope: null,
                    uid: null,
                    labels: null,
                    body: null,
                };
                obj.flags = msg.flags;
                obj.envelope = msg.envelope;
                obj.uid = msg.uid;
                obj.labels = msg.labels;
                const parsed = await simpleParser(msg.source);
                obj.body = parsed;
                messageArray.push(obj);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return messageArray;
    }
    catch (err) {
        console.error('feaching email error - ', err);
        return messageArray;
    }
    finally {
        lock.release();
        await client.logout();
    }
}
exports.fetchMail = fetchMail;
//# sourceMappingURL=fetchMail.js.map