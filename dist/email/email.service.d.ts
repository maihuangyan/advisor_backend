/// <reference types="multer" />
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateEmailDto } from "./dto/create-email.dto";
import { Email } from "./entities/email.entity";
import { EmailAttachmentService } from "src/email-attachment/email-attachment.service";
import { ConfigurationService } from "src/configuration/configuration.service";
export declare class EmailService extends BaseService {
    private emailRepository;
    private readonly emailAttachmentService;
    private readonly configurationService;
    constructor(emailRepository: Repository<Email>, emailAttachmentService: EmailAttachmentService, configurationService: ConfigurationService);
    create(advisorId: string, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any>;
    sendMail(from: string, to: string, subject: string, content: string, reply_on: string, attachments: Array<any>): Promise<any>;
    getInbox(vmail: string): Promise<any>;
    syncMails(email: string): Promise<any>;
    saveAttachment(filename: string, buffer: any): Promise<any>;
    getContent(id: number): Promise<any>;
    getSent(vmail: string): Promise<any>;
    getDrafts(vmail: string): Promise<any>;
    getTrash(vmail: string): Promise<any>;
    saveDraft(advisorId: string, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any>;
    sendDraft(mailId: number): Promise<any>;
    setReadUnread(mailId: number, status: number): Promise<any>;
    trashOrDelete(mailId: number): Promise<any>;
    trash(mailId: number): Promise<any>;
    delete(mailId: number): Promise<any>;
    restore(advisorEmail: string, mailId: number): Promise<any>;
    trashMany(mailIds: string): Promise<any>;
    deleteMany(mailIds: string): Promise<any>;
    saveAttachments(files: Array<Express.Multer.File>): Promise<any[]>;
}
