import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from 'src/email/entities/email.entity';
import { m_constants } from 'src/utils/const';
import { BaseService } from 'src/_base/base.service';
import { Repository } from 'typeorm';
import { CreateEmailAttachmentDto } from './dto/create-email-attachment.dto';
import { UpdateEmailAttachmentDto } from './dto/update-email-attachment.dto';
import { EmailAttachment } from './entities/email-attachment.entity';

@Injectable()
export class EmailAttachmentService extends BaseService {

  constructor(
    @InjectRepository(EmailAttachment)
    private mRepository: Repository<EmailAttachment>
  ) {
    super();
  }

  async create(dto: CreateEmailAttachmentDto) {
    const entity = new EmailAttachment(dto);
    return await this.mRepository.save(entity);
  }

  async saveEmailAttachment(email: Email, dto: CreateEmailAttachmentDto) {
    const entity = new EmailAttachment(dto);
    entity.email = email;
    return await this.mRepository.save(entity);
  }

  async setAttachmentEmail(attachment: string, email: Email): Promise<any> {
    const attachmentEntity = await this.mRepository.findOne({filename: attachment});
    if (attachmentEntity) {
      attachmentEntity.email = email;
      return await this.mRepository.save(attachmentEntity);
    }
    else {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailInvalidAttachment }
    }
  }

  findAll() {
    return `This action returns all emailAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emailAttachment`;
  }

  update(id: number, updateEmailAttachmentDto: UpdateEmailAttachmentDto) {
    return `This action updates a #${id} emailAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailAttachment`;
  }
}
