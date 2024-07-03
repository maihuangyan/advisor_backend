import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailAttachmentDto } from './create-email-attachment.dto';

export class UpdateEmailAttachmentDto extends PartialType(CreateEmailAttachmentDto) {}
