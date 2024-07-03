import { Test, TestingModule } from "@nestjs/testing";
import { EmailController } from "./room.controller";
import { EmailService } from "./room.service";

describe("EmailController", () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
