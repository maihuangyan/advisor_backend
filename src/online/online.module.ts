import { Module } from "@nestjs/common";
import { OnlineService } from "./online.service";
import { OnlineController } from './online.controller';

@Module({
  providers: [OnlineService],
  exports: [OnlineService],
  controllers: [OnlineController],
})
export class OnlineModule {}
