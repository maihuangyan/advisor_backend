import { Module } from "@nestjs/common";
import { ConnectionService } from "./connection.service";
import { ConnectionController } from "./connection.controller";
import { ClientModule } from "src/client/client.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "./entities/connection.entity";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { OnlineModule } from "src/online/online.module";
import { RoomModule } from "src/room/room.module";
import { ZoomModule } from "src/zoom/zoom.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([Connection]),
    ClientModule,
    AuthModule,
    UserModule,
    OnlineModule,
    RoomModule,
    ZoomModule,
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
