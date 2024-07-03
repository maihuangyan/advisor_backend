import { Test, TestingModule } from '@nestjs/testing';
import { EmailAttachmentController } from './email-attachment.controller';
import { EmailAttachmentService } from './email-attachment.service';

describe('EmailAttachmentController', () => {
  let controller: EmailAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailAttachmentController],
      providers: [EmailAttachmentService],
    }).compile();

    controller = module.get<EmailAttachmentController>(EmailAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
