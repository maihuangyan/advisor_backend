import { ImapFlow } from "imapflow";

import { imapConfig } from "../../utils/config_local";

export async function moveMail(email, srcPath, destPath, uid): Promise<any> {
  imapConfig.auth.user = email;
  const client = new ImapFlow(imapConfig);

  await client.connect();
  const lock = await client.getMailboxLock(srcPath);

  try {
    const result = await client.messageMove(uid, destPath, { uid: true });
    console.log("move result:", result);
  } catch (err) {
    console.error(err);
  } finally {
    lock.release();
    await client.logout();
  }
}
