import { BaseService } from "src/_base/base.service";
import { RoomUser } from "./entities/room-user";
import { RoomUsers } from "./entities/room-users";
export declare class OnlineService extends BaseService {
    rooms: RoomUsers[];
    constructor();
    addUser(user: RoomUser): void;
    checkExist(room_id: string, token: string): number;
    getRooms(): RoomUsers[];
    getRoom(room_id: string): RoomUsers;
    checkExistBySocketID(room_id: string, socket_id: string): number;
    removeRoom(room_id: string): void;
    removeUser(room_id: string, token: string): void;
    removeUserBySocketID(room_id: string, socket_id: string): void;
    getRoomIds(): any[];
    getRoomIdsWhichHasUsers(): any[];
    pairSocketIDandToken(socket_id: string, token: string): void;
    getUserByUserID(id: string): RoomUser;
    getUserByToken(token: string): RoomUser;
    getUserBySocketID(socket_id: string): RoomUser;
    getRoomIDsBySocketID(socket_id: string): string[];
    getRoomsBySocketID(socket_id: string): RoomUsers[];
    getRoomIDsByUser(token: string): string[];
    getRoomsByUser(token: string): RoomUsers[];
    getRoomsByUserID(user_id: string): RoomUsers[];
    getRoomsOnlineStatus(token: string): {};
    getAdvisorRoomsOnlineStatus(advisor_id: number): {};
}
