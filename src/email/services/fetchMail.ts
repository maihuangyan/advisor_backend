import { ImapFlow } from "imapflow";
import mailparser from "mailparser";

import { imapConfig } from "../../utils/config_local";

const simpleParser = mailparser.simpleParser;

export async function fetchMail(
  email: string,
  path: string,
  count: number
): Promise<any> {
  imapConfig.auth.user = email;
  console.log('fetch config - ', imapConfig);
  const client = new ImapFlow(imapConfig);

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
    for await (const msg of client.fetch(
      `${startIndex}:${endIndex}`,
      options
    )) {
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
