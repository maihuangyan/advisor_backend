import { Test, TestingModule } from '@nestjs/testing';
import { EmailAttachmentService } from './email-attachment.service';

describe('EmailAttachmentService', () => {
  let service: EmailAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailAttachmentService],
    }).compile();

    service = module.get<EmailAttachmentService>(EmailAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
