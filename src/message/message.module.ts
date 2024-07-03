import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entities/message.entity";
import { diskStorage } from "multer";
import { editFileName } from "src/utils/utils";
import { RoomModule } from "src/room/room.module";
import { OnlineModule } from "src/online/online.module";
import { ClientModule } from "src/client/client.module";
import { UserModule } from "src/user/user.module";
import { NexeroneModule } from "src/nexerone/nexerone.module";
import { ConnectionModule } from "src/connection/connection.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "./uploads/message",
        storage: diskStorage({
          destination: "./uploads/message",
          filename: (req, file, cb) => {
            editFileName(req, file, cb);
          },
        }),
      }),
    }),
    RoomModule,
    OnlineModule,
    ClientModule,
    UserModule,
    NexeroneModule,
    ConnectionModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
