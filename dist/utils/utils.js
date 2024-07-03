"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoinType = exports.consoleLogColors = exports.getCurrentMilliSeconds = exports.getLine = exports.getTimezoneList = exports.getTimeZone = exports.convertMessage = exports.now = exports.randomString = exports.editFileName = void 0;
const path_1 = require("path");
const timezones_json_1 = __importDefault(require("./timezones.json"));
const metal_currency_enum_1 = require("../currency-rate/entities/enum/metal_currency.enum");
const balance_type_enum_1 = require("../balance/entities/enum/balance_type.enum");
const editFileName = (req, file, callback) => {
    const fileExtName = path_1.extname(file.originalname);
    const randomStr = exports.randomString(40, null) + exports.now();
    callback(null, `${randomStr}${fileExtName}`);
};
exports.editFileName = editFileName;
const randomString = (len, charSet = "") => {
    charSet =
        charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    if (len > 13) {
        for (let i = 0; i < len - 13; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        randomString += exports.now();
    }
    else {
        for (let i = 0; i < len; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
    }
    return randomString;
};
exports.randomString = randomString;
const now = () => {
    return "" + Math.floor(Date.now());
};
exports.now = now;
const convertMessage = (message) => {
    message.id = "" + message.id;
    message.uesr_id = "" + message.user_id;
    message.room_id = "" + message.room_id;
    message.type = "" + message.type;
    message.created_at = "" + message.created_at;
    message.updated_at = "" + message.updated_at;
    message.deleted_at = message.deleted_at ? "" + message.deleted_at : "";
    message.status = "" + message.status;
    message.seen_status = "" + message.seen_status;
    return message;
};
exports.convertMessage = convertMessage;
const getTimeZone = (text) => {
    for (const timezone of timezones_json_1.default) {
        if (timezone.text == text) {
            return timezone;
        }
    }
    return null;
};
exports.getTimeZone = getTimeZone;
const getTimezoneList = () => {
    return timezones_json_1.default;
};
exports.getTimezoneList = getTimezoneList;
const getLine = () => {
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/;
    const match = regex.exec(e.stack.split("\n")[3]);
    if (!match || match.length < 3) {
        return e.message;
    }
    const nodes = match[1].split("/");
    const fileName = nodes[nodes.length - 1];
    return `${fileName}: ${match[2]} - `;
};
exports.getLine = getLine;
const getCurrentMilliSeconds = () => {
    return new Date().getTime();
};
exports.getCurrentMilliSeconds = getCurrentMilliSeconds;
exports.consoleLogColors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};
const getCoinType = (coinCurrency) => {
    if (coinCurrency == metal_currency_enum_1.MetalCurrency.XAU) {
        return balance_type_enum_1.BalanceType.Goldbar;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.XAG) {
        return balance_type_enum_1.BalanceType.Silverbar;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.GEA) {
        return balance_type_enum_1.BalanceType.Gold;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.SEA) {
        return balance_type_enum_1.BalanceType.Silver;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.GPA) {
        return balance_type_enum_1.BalanceType.Gold;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.SPA) {
        return balance_type_enum_1.BalanceType.Silver;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.GKS) {
        return balance_type_enum_1.BalanceType.Gold;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.SKS) {
        return balance_type_enum_1.BalanceType.Silver;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.GBB) {
        return balance_type_enum_1.BalanceType.Gold;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.SBB) {
        return balance_type_enum_1.BalanceType.Silver;
    }
    else if (coinCurrency == metal_currency_enum_1.MetalCurrency.GSV) {
        return balance_type_enum_1.BalanceType.Gold;
    }
    else {
        return balance_type_enum_1.BalanceType.Card;
    }
};
exports.getCoinType = getCoinType;
//# sourceMappingURL=utils.js.map