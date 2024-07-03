import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./entities/room.entity";
export declare class RoomService extends BaseService {
    private mRepository;
    constructor(mRepository: Repository<Room>);
    createIfNotExist(createRoomDto: CreateRoomDto): Promise<any>;
    create(createRoomDto: CreateRoomDto): Promise<any>;
    findAll(): Promise<Room[]>;
    findOne(id: number): Promise<Room>;
    findByAdvisorAndClient(advisor_id: number, client_id: string): Promise<Room>;
    findById(id: number): Promise<Room>;
    findRooms(client_ids: string[]): Promise<Room[]>;
    findAdvisorRooms(advisor_id: number): Promise<Room[]>;
    findClientRooms(client_id: string): Promise<Room[]>;
    update(id: number, dto: UpdateRoomDto): Promise<Room>;
    remove(id: number): Promise<void>;
    removeAdvisorRooms(advisor_id: number): Promise<void>;
}
