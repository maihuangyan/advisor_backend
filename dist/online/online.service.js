"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../_base/base.service");
const room_users_1 = require("./entities/room-users");
let OnlineService = class OnlineService extends base_service_1.BaseService {
    constructor() {
        super();
        this.rooms = [];
    }
    addUser(user) {
        const room = this.getRoom(user.room_id);
        if (room) {
            const index = this.checkExist(user.room_id, user.token);
            if (index > -1) {
                room.users[index] = user;
            }
            else {
                room.users.push(user);
            }
        }
        else {
            const newRoom = new room_users_1.RoomUsers();
            newRoom.room_id = user.room_id;
            newRoom.users = [user];
            this.rooms.push(newRoom);
        }
    }
    checkExist(room_id, token) {
        const room = this.getRoom(room_id);
        for (let i = 0; i < room.users.length; i++) {
            const user = room.users[i];
            if (user.token == token) {
                return i;
            }
        }
        return -1;
    }
    getRooms() {
        return this.rooms;
    }
    getRoom(room_id) {
        for (let i = 0; i < this.rooms.length; i++) {
            const item = this.rooms[i];
            if (item.room_id == room_id) {
                return item;
            }
        }
        return null;
    }
    checkExistBySocketID(room_id, socket_id) {
        const room = this.getRoom(room_id);
        for (let i = 0; i < room.users.length; i++) {
            const user = room.users[i];
            if (user.socket_id == socket_id) {
                return i;
            }
        }
        return -1;
    }
    removeRoom(room_id) {
        this.consoleLog('room_id', room_id);
        for (let i = 0; i < this.rooms.length; i++) {
            const item = this.rooms[i];
            if (item.room_id == room_id) {
                this.rooms.splice(i, 1);
            }
        }
    }
    removeUser(room_id, token) {
        this.consoleLog('room_id', room_id);
        this.consoleLog('token', token);
        const index = this.checkExist(room_id, token);
        if (index > -1) {
            const room = this.getRoom(room_id);
            room.users.splice(index, 1);
        }
    }
    removeUserBySocketID(room_id, socket_id) {
        this.consoleLog('room_id', room_id);
        this.consoleLog('socket_id', socket_id);
        const index = this.checkExistBySocketID(room_id, socket_id);
        if (index > -1) {
            const room = this.getRoom(room_id);
            room.users.splice(index, 1);
        }
    }
    getRoomIds() {
        const roomIds = [];
        this.rooms.forEach((room) => {
            roomIds.push(room.room_id);
        });
        return roomIds;
    }
    getRoomIdsWhichHasUsers() {
        const roomIds = [];
        this.rooms.forEach((room) => {
            if (room.users.length > 0)
                roomIds.push(room.room_id);
        });
        return roomIds;
    }
    pairSocketIDandToken(socket_id, token) {
        this.rooms.forEach((room) => {
            room.users.forEach((user) => {
                if (user.socket_id == socket_id) {
                    user.token = token;
                }
                else if (user.token == token) {
                    user.socket_id = socket_id;
                }
            });
        });
    }
    getUserByUserID(id) {
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            for (let j = 0; j < room.users.length; j++) {
                const user = room.users[j];
                if (user.user_id == id) {
                    return user;
                }
            }
        }
        return null;
    }
    getUserByToken(token) {
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            for (let j = 0; j < room.users.length; j++) {
                const user = room.users[j];
                if (user.token == token) {
                    return user;
                }
            }
        }
        return null;
    }
    getUserBySocketID(socket_id) {
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            for (let j = 0; j < room.users.length; j++) {
                const user = room.users[j];
                if (user.socket_id == socket_id) {
                    return user;
                }
            }
        }
        return null;
    }
    getRoomIDsBySocketID(socket_id) {
        const result = [];
        this.rooms.forEach((room) => {
            room.users.forEach((user) => {
                if (user.socket_id == socket_id) {
                    result.push(room.room_id);
                }
            });
        });
        return result;
    }
    getRoomsBySocketID(socket_id) {
        const result = [];
        this.rooms.forEach((room) => {
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.socket_id == socket_id) {
                    result.push(room);
                    break;
                }
            }
        });
        return result;
    }
    getRoomIDsByUser(token) {
        const result = [];
        this.rooms.forEach((room) => {
            room.users.forEach((user) => {
                if (user.token == token)
                    result.push(room.room_id);
            });
        });
        return result;
    }
    getRoomsByUser(token) {
        const result = [];
        this.rooms.forEach((room) => {
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.token == token) {
                    result.push(room);
                    break;
                }
            }
        });
        return result;
    }
    getRoomsByUserID(user_id) {
        const result = [];
        this.rooms.forEach((room) => {
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.user_id == user_id) {
                    result.push(room);
                    break;
                }
            }
        });
        return result;
    }
    getRoomsOnlineStatus(token) {
        const result = {};
        this.rooms.forEach((room) => {
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.token == token) {
                    result[room.room_id] = false;
                    for (let j = 0; j < room.users.length; j++) {
                        const jUser = room.users[j];
                        if (user.user_id != jUser.user_id) {
                            result[room.room_id] = true;
                            break;
                        }
                    }
                    break;
                }
            }
        });
        return result;
    }
    getAdvisorRoomsOnlineStatus(advisor_id) {
        const result = {};
        const advisorRooms = this.getRoomsByUserID("" + advisor_id);
        advisorRooms.forEach((room) => {
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                result[room.room_id] = false;
                if (user.user_id != "" + advisor_id) {
                    result[room.room_id] = true;
                    break;
                }
            }
        });
        return result;
    }
};
OnlineService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], OnlineService);
exports.OnlineService = OnlineService;
//# sourceMappingURL=online.service.js.map