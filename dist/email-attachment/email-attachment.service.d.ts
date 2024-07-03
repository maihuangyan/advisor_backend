import { Email } from 'src/email/entities/email.entity';
import { BaseService } from 'src/_base/base.service';
import { Repository } from 'typeorm';
import { CreateEmailAttachmentDto } from './dto/create-email-attachment.dto';
import { UpdateEmailAttachmentDto } from './dto/update-email-attachment.dto';
import { EmailAttachment } from './entities/email-attachment.entity';
export declare class EmailAttachmentService extends BaseService {
    private mRepository;
    constructor(mRepository: Repository<EmailAttachment>);
    create(dto: CreateEmailAttachmentDto): Promise<EmailAttachment>;
    saveEmailAttachment(email: Email, dto: CreateEmailAttachmentDto): Promise<EmailAttachment>;
    setAttachmentEmail(attachment: string, email: Email): Promise<any>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEmailAttachmentDto: UpdateEmailAttachmentDto): string;
    remove(id: number): string;
}
