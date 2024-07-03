import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Message } from "./entities/message.entity";
import { RoomService } from "src/room/room.service";
import { OnlineService } from "src/online/online.service";
import { ClientService } from "src/client/client.service";
import { Role } from "src/guards/enum/role.enum";
import { UserService } from "src/user/user.service";
import { ConnectionService } from "src/connection/connection.service";
export declare class MessageService extends BaseService {
    private mRepository;
    private readonly roomService;
    private readonly onlineService;
    private readonly clientService;
    private readonly userService;
    private readonly connectionService;
    constructor(mRepository: Repository<Message>, roomService: RoomService, onlineService: OnlineService, clientService: ClientService, userService: UserService, connectionService: ConnectionService);
    create(createMessageDto: CreateMessageDto): Promise<any>;
    findAll(): string;
    findRoomsWithMessages(advisor_id: number): Promise<any[]>;
    findRoomMessages(room_id: string, offset: number, limit: number, caller: Role): Promise<Message[]>;
    findRoomLastMessages(email: string, room_id: string, last_message_id: string, caller: Role): Promise<Message[] | {
        error: number;
    }>;
    getAdvisorUnreadMessages(advisor_id: number): Promise<unknown[]>;
    findClient(clients: any[], email: string): any;
    findOne(id: number): Promise<Message>;
    update(id: number, dto: UpdateMessageDto): Promise<Message>;
    clearRoomMessages(user: any, room_id: string, role: Role): Promise<import("typeorm").UpdateResult | {
        error: number;
    }>;
    clearAdvisorMessages(advisor_id: number, client_id: string): Promise<import("typeorm").UpdateResult | {
        error: number;
    }>;
    clearClientMessages(client_id: string): Promise<true | import("typeorm").UpdateResult>;
    addSeen(id: number): Promise<Message>;
    remove(id: number): Promise<void>;
    updateRoomsWithClientPhoto(): Promise<boolean>;
}
