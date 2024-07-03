import { Test, TestingModule } from "@nestjs/testing";
import { NexeroneService } from "./nexerone.service";

describe("NexeroneService", () => {
  let service: NexeroneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NexeroneService],
    }).compile();

    service = module.get<NexeroneService>(NexeroneService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
