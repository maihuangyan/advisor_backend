import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { OnlineModule } from "src/online/online.module";
import { MessageModule } from "src/message/message.module";
import { UserModule } from "src/user/user.module";
import { RoomModule } from "src/room/room.module";
import { AuthModule } from "src/auth/auth.module";
import { ConnectionModule } from "src/connection/connection.module";
import { ClientModule } from "src/client/client.module";
import { NexeroneModule } from "src/nexerone/nexerone.module";

@Module({
  imports: [
    AuthModule,
    OnlineModule,
    UserModule,
    RoomModule,
    MessageModule,
    ConnectionModule,
    ClientModule,
    NexeroneModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
