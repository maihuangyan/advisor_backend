import { OnGatewayDisconnect } from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Server, Socket } from "socket.io";
import { OnlineService } from "src/online/online.service";
import { BaseGateway } from "src/_base/base.gateway";
export declare class ChatGateway extends BaseGateway implements OnGatewayDisconnect {
    private readonly chatService;
    private readonly onlineService;
    constructor(chatService: ChatService, onlineService: OnlineService);
    server: Server;
    handleLoginEvent(data: any, client: Socket): Promise<void>;
    joinRoom(param: any, client: Socket): void;
    handleTypingEvent(data: any, client: Socket): Promise<void>;
    handleMessageEvent(data: any, client: Socket): Promise<void>;
    handleOpenMessageEvent(data: any, client: Socket): Promise<void>;
    handleDeleteMessageEvent(data: any, client: Socket): Promise<void>;
    handleLogoutEvent(data: any, client: Socket): void;
    handleDisconnectEvent(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
