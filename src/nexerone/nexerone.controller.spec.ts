import { Test, TestingModule } from "@nestjs/testing";
import { NexeroneController } from "./nexerone.controller";
import { NexeroneService } from "./nexerone.service";

describe("NexeroneController", () => {
  let controller: NexeroneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NexeroneController],
      providers: [NexeroneService],
    }).compile();

    controller = module.get<NexeroneController>(NexeroneController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
