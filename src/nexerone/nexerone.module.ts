import { Module } from "@nestjs/common";
import { NexeroneService } from "./nexerone.service";
import { NexeroneController } from "./nexerone.controller";

@Module({
  controllers: [NexeroneController],
  providers: [NexeroneService],
  exports: [NexeroneService],
})
export class NexeroneModule {}
