import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./entities/room.entity";
import { OnlineService } from "src/online/online.service";
import { BaseController } from "src/_base/base.controller";
export declare class RoomController extends BaseController {
    private readonly roomService;
    private readonly onlineService;
    constructor(roomService: RoomService, onlineService: OnlineService);
    create(createRoomDto: CreateRoomDto): Promise<any>;
    findAll(): Promise<Room[]>;
    findOne(id: string): Promise<Room>;
    advisorRooms(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    onlineUsers(room_id: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
    remove(id: string): Promise<void>;
}
