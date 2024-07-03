import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailAttachmentService } from './email-attachment.service';
import { CreateEmailAttachmentDto } from './dto/create-email-attachment.dto';
import { UpdateEmailAttachmentDto } from './dto/update-email-attachment.dto';

@Controller('email-attachment')
export class EmailAttachmentController {
  constructor(private readonly emailAttachmentService: EmailAttachmentService) {}

  @Post()
  create(@Body() createEmailAttachmentDto: CreateEmailAttachmentDto) {
    return this.emailAttachmentService.create(createEmailAttachmentDto);
  }

  @Get()
  findAll() {
    return this.emailAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailAttachmentDto: UpdateEmailAttachmentDto) {
    return this.emailAttachmentService.update(+id, updateEmailAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailAttachmentService.remove(+id);
  }
}
