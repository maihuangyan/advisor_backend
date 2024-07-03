/// <reference types="multer" />
import { BaseController } from "src/_base/base.controller";
import { CreateEmailDto } from "./dto/create-email.dto";
import { EmailService } from "./email.service";
export declare class EmailController extends BaseController {
    private readonly emailService;
    constructor(emailService: EmailService);
    create(req: any, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any>;
    getInbox(req: any): Promise<any>;
    getContent(mailId: number): Promise<any>;
    getSent(req: any): Promise<any>;
    getDrafts(req: any): Promise<any>;
    getDeleted(req: any): Promise<any>;
    saveDraft(req: any, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any>;
    sendDraft(mailId: number): Promise<any>;
    setReadUnread(mailId: number, data: any): Promise<any>;
    deleteOrPurge(mailId: number): Promise<any>;
    trash(mailId: number): Promise<any>;
    delete(mailId: number): Promise<any>;
    restore(req: any, mailId: number): Promise<any>;
    moveToTrash(param: any): Promise<any>;
    deleteMany(param: any): Promise<any>;
    uploadFile(files: Array<Express.Multer.File>): Promise<any[]>;
    getFile(filename: string, res: any): any;
}
