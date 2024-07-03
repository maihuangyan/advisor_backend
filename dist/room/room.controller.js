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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const online_service_1 = require("../online/online.service");
const base_controller_1 = require("../_base/base.controller");
const const_1 = require("../utils/const");
let RoomController = class RoomController extends base_controller_1.BaseController {
    constructor(roomService, onlineService) {
        super();
        this.roomService = roomService;
        this.onlineService = onlineService;
    }
    create(createRoomDto) {
        return this.roomService.create(createRoomDto);
    }
    findAll() {
        return this.roomService.findAll();
    }
    findOne(id) {
        return this.roomService.findOne(+id);
    }
    async advisorRooms(req) {
        const userID = req.user.id;
        const rooms = await this.roomService.findAdvisorRooms(userID);
        let result = [];
        if (rooms.length > 0) {
            rooms.forEach((room) => {
                let roomUsers = this.onlineService.getRoom(`${room.id}`);
                result.push({
                    room: room,
                    users: roomUsers.users,
                });
            });
        }
        return this.response(result);
    }
    async onlineUsers(room_id) {
        const room = this.onlineService.getRoom(room_id);
        if (room) {
            return this.response(room.users);
        }
        else {
            return this.response({
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeUserListInvalidRoomID,
            });
        }
    }
    update(id, updateRoomDto) {
        return this.roomService.update(+id, updateRoomDto);
    }
    remove(id) {
        return this.roomService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findAll", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findOne", null);
__decorate([
    common_1.Get("list"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "advisorRooms", null);
__decorate([
    common_1.Get("online_users/:room_id"),
    __param(0, common_1.Param("room_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "onlineUsers", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "remove", null);
RoomController = __decorate([
    common_1.Controller("room"),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        online_service_1.OnlineService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map