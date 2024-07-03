import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { ConnectionModule } from "src/connection/connection.module";
import { WorkTimeModule } from "src/work-time/work-time.module";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/utils/config_local";
import { ZoomModule } from "src/zoom/zoom.module";
import { NexeroneModule } from "src/nexerone/nexerone.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    ConnectionModule,
    WorkTimeModule,
    UserModule,
    ZoomModule,
    NexeroneModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "3600s" },
    }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
