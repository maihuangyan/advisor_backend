import { OnlineService } from "src/online/online.service";
import { AuthService } from "src/auth/auth.service";
import { RoomService } from "src/room/room.service";
import { MessageService } from "src/message/message.service";
import { ConnectionService } from "src/connection/connection.service";
import { ClientService } from "src/client/client.service";
import { BaseService } from "src/_base/base.service";
import { Message } from "src/message/entities/message.entity";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { UserService } from "src/user/user.service";
export declare class ChatService extends BaseService {
    private readonly authService;
    private readonly onlineService;
    private readonly roomService;
    private readonly messageService;
    private readonly connectionService;
    private readonly userService;
    private readonly clientService;
    private readonly nexeroneService;
    constructor(authService: AuthService, onlineService: OnlineService, roomService: RoomService, messageService: MessageService, connectionService: ConnectionService, userService: UserService, clientService: ClientService, nexeroneService: NexeroneService);
    login(param: any, socket_id: string): Promise<any>;
    typing(param: any, socket_id: string): Promise<any>;
    sendMessage(param: any, socket_id: string): Promise<any>;
    sendPushNotification(clientEmail: string, message: Message): void;
    openMessage(param: any, socket_id: string): Promise<any>;
    deleteMessage(param: any, socket_id: string): Promise<any>;
    logout(param: any, socket_id: string): any;
    disconnect(socket_id: any): any;
}
