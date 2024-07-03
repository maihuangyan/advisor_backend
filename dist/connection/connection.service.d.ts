import { AuthService } from "src/auth/auth.service";
import { ClientService } from "src/client/client.service";
import { OnlineService } from "src/online/online.service";
import { RoomService } from "src/room/room.service";
import { UserService } from "src/user/user.service";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateConnectionDto } from "./dto/create-connection.dto";
import { UpdateConnectionDto } from "./dto/update-connection.dto";
import { Connection } from "./entities/connection.entity";
export declare class ConnectionService extends BaseService {
    private mRepository;
    private readonly clientService;
    private readonly authService;
    private readonly userService;
    private readonly onlineService;
    private readonly roomService;
    private readonly zoomService;
    constructor(mRepository: Repository<Connection>, clientService: ClientService, authService: AuthService, userService: UserService, onlineService: OnlineService, roomService: RoomService, zoomService: ZoomService);
    create(dto: CreateConnectionDto, triedSaveClient?: boolean): any;
    advisor_clients(displayCurrency: string, advisor_id: number): Promise<any[] | {
        total: number;
        clients: any[];
        allData: any[];
    }>;
    advisor_connections(advisor_id: number): Promise<Connection[]>;
    advisor_overview(displayCurrency: string, advisor_id: number, advisor_email: string, refresh: number): Promise<any>;
    find(advisor_id: number, page: number, limit: number, status: string, search_key: string, displayCurrency: string): Promise<{
        total: number;
        clients: any[];
        allData: any[];
    }>;
    updateClientFees(data: any): Promise<any>;
    findOne(id: number): Promise<Connection>;
    findAdvisorConnections(advisor_id: number): Promise<Connection[]>;
    findConnection(advisor_id: number, client_id: number): Promise<Connection>;
    findByClient(token: string): Promise<any>;
    findByClientEmail(client_email: string): Promise<Connection>;
    update(id: number, dto: UpdateConnectionDto): Promise<Connection>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeConnection(advisor_id: number, client_id: number): Promise<import("typeorm").DeleteResult>;
    deleteAdvisor(advisor_id: number): Promise<any>;
    removeAdvisorConnections(advisor_id: number): Promise<void>;
}
