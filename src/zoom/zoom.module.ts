import { Module } from "@nestjs/common";
import { ZoomService } from "./zoom.service";
import { ZoomController } from "./zoom.controller";
import { NexeroneModule } from "src/nexerone/nexerone.module";

@Module({
  imports: [NexeroneModule],
  controllers: [ZoomController],
  providers: [ZoomService],
  exports: [ZoomService],
})
export class ZoomModule {}
