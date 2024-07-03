import { EmailAttachmentService } from './email-attachment.service';
import { CreateEmailAttachmentDto } from './dto/create-email-attachment.dto';
import { UpdateEmailAttachmentDto } from './dto/update-email-attachment.dto';
export declare class EmailAttachmentController {
    private readonly emailAttachmentService;
    constructor(emailAttachmentService: EmailAttachmentService);
    create(createEmailAttachmentDto: CreateEmailAttachmentDto): Promise<import("./entities/email-attachment.entity").EmailAttachment>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEmailAttachmentDto: UpdateEmailAttachmentDto): string;
    remove(id: string): string;
}
