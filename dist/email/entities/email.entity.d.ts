import { EmailAttachment } from "src/email-attachment/entities/email-attachment.entity";
export declare class Email {
    id: number;
    message_id: string;
    flags: string;
    name: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    textAsHtml: string;
    html: string;
    date: Date;
    mailbox: string;
    reply_on: string;
    created_at: Date;
    deleted_at: Date;
    attachments: EmailAttachment[];
    status: number;
}
