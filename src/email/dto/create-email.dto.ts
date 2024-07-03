import { IsNotEmpty } from "class-validator";

export class CreateEmailDto {
  name: string;

  from: string;

  to: string;

  subject: string;

  content: string;

  mailbox: string;

  reply_on: string;
}
