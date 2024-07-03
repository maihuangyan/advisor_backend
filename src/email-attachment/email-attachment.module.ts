import { Module } from '@nestjs/common';
import { EmailAttachmentService } from './email-attachment.service';
import { EmailAttachmentController } from './email-attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAttachment } from './entities/email-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAttachment])
  ],
  controllers: [EmailAttachmentController],
  providers: [EmailAttachmentService],
  exports: [EmailAttachmentService]
})
export class EmailAttachmentModule {}
