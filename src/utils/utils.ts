import path, { extname } from "path";
import timezoneList from "./timezones.json";
import { MetalCurrency } from "src/currency-rate/entities/enum/metal_currency.enum";
import { BalanceType } from "src/balance/entities/enum/balance_type.enum";

export const editFileName = (req, file, callback) => {
  //const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomStr = randomString(40, null) + now();
  callback(null, `${randomStr}${fileExtName}`);
};

export const randomString = (len: number, charSet: string = "" ) => {
  charSet =
    charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  if (len > 13) {
    for (let i = 0; i < len - 13; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }

    randomString += now();
  } else {
    for (let i = 0; i < len; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
  }

  return randomString;
};

export const now = () => {
  return "" + Math.floor(Date.now());
};

export const convertMessage = (message) => {
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

export const getTimeZone = (text: string) => {
  for (const timezone of timezoneList) {
    if (timezone.text == text) {
      return timezone;
    }
  }
  return null;
};

export const getTimezoneList = () => {
  return timezoneList;
};

export const getLine = () => {
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack.split("\n")[3]);
  if (!match || match.length < 3) {
    return e.message;
  }

  const nodes = match[1].split("/");
  const fileName = nodes[nodes.length - 1];

  return `${fileName}: ${match[2]} - `;

  // return {
  //   filepath: match[1],
  //   line: match[2],
  //   column: match[3]
  // };
};

export const getCurrentMilliSeconds = () => {
  return new Date().getTime();
}

export const consoleLogColors = {
  Reset : "\x1b[0m",
  Bright : "\x1b[1m",
  Dim : "\x1b[2m",
  Underscore : "\x1b[4m",
  Blink : "\x1b[5m",
  Reverse : "\x1b[7m",
  Hidden : "\x1b[8m",

  FgBlack : "\x1b[30m",
  FgRed : "\x1b[31m",
  FgGreen : "\x1b[32m",
  FgYellow : "\x1b[33m",
  FgBlue : "\x1b[34m",
  FgMagenta : "\x1b[35m",
  FgCyan : "\x1b[36m",
  FgWhite : "\x1b[37m",

  BgBlack : "\x1b[40m",
  BgRed : "\x1b[41m",
  BgGreen : "\x1b[42m",
  BgYellow : "\x1b[43m",
  BgBlue : "\x1b[44m",
  BgMagenta : "\x1b[45m",
  BgCyan : "\x1b[46m",
  BgWhite : "\x1b[47m",
}

export const getCoinType = (coinCurrency: string) => {
  if (coinCurrency == MetalCurrency.XAU) {
    return BalanceType.Goldbar
  }
  else if (coinCurrency == MetalCurrency.XAG) {
    return BalanceType.Silverbar
  }
  else if (coinCurrency == MetalCurrency.GEA) {
    return BalanceType.Gold
  }
  else if (coinCurrency == MetalCurrency.SEA) {
    return BalanceType.Silver
  }
  else if (coinCurrency == MetalCurrency.GPA) {
    return BalanceType.Gold
  }
  else if (coinCurrency == MetalCurrency.SPA) {
    return BalanceType.Silver
  }
  else if (coinCurrency == MetalCurrency.GKS) {
    return BalanceType.Gold
  }
  else if (coinCurrency == MetalCurrency.SKS) {
    return BalanceType.Silver
  }
  else if (coinCurrency == MetalCurrency.GBB) {
    return BalanceType.Gold
  }
  else if (coinCurrency == MetalCurrency.SBB) {
    return BalanceType.Silver
  }
  else if (coinCurrency == MetalCurrency.GSV) {
    return BalanceType.Gold
  }
  else {
    return BalanceType.Card
  }
}

