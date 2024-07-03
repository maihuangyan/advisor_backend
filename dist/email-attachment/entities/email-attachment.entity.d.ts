import { Email } from "src/email/entities/email.entity";
import { CreateEmailAttachmentDto } from "../dto/create-email-attachment.dto";
export declare class EmailAttachment {
    id: number;
    email: Email;
    filename: string;
    origin_filename: string;
    constructor(dto: CreateEmailAttachmentDto);
}
