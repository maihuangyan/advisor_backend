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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const socket_io_1 = require("socket.io");
const const_1 = require("../utils/const");
const config_local_1 = require("../utils/config_local");
const room_user_1 = require("../online/entities/room-user");
const class_validator_1 = require("class-validator");
const online_service_1 = require("../online/online.service");
const base_gateway_1 = require("../_base/base.gateway");
let ChatGateway = class ChatGateway extends base_gateway_1.BaseGateway {
    constructor(chatService, onlineService) {
        super();
        this.chatService = chatService;
        this.onlineService = onlineService;
    }
    async handleLoginEvent(data, client) {
        const result = await this.chatService.login(data, client.id);
        if (result.error) {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
        else {
            if (result.room_ids && class_validator_1.isArray(result.room_ids)) {
                result.room_ids.forEach((room_id) => {
                    const param = Object.assign({}, result);
                    delete param.room_ids;
                    param.room_id = room_id;
                    this.joinRoom(param, client);
                });
            }
            else if (result.room_id) {
                this.joinRoom(result, client);
            }
        }
    }
    joinRoom(param, client) {
        let roomUserIDs = "";
        const room = this.onlineService.getRoom(param.room_id);
        if (room && room.users && room.users.length > 0) {
            for (const user of room.users) {
                if (param.user_id != user.user_id) {
                    if (roomUserIDs) {
                        roomUserIDs += "," + user.user_id;
                    }
                    else {
                        roomUserIDs += user.user_id;
                    }
                }
            }
        }
        param.already_joined_user_ids = roomUserIDs;
        client.join(param.room_id.toString());
        this.server
            .of(config_local_1.socketConfigs.socketNameSpace)
            .in(param.room_id.toString())
            .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_NEW_USER, param);
        const newUser = new room_user_1.RoomUser(param.token, param.user_id, param.room_id, client.id);
        this.onlineService.addUser(newUser);
        this.onlineService.pairSocketIDandToken(client.id, param.token);
    }
    async handleTypingEvent(data, client) {
        const result = await this.chatService.typing(data, client.id);
        if (result.error) {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
        else {
            this.server
                .of(config_local_1.socketConfigs.socketNameSpace)
                .in(result.room_id.toString())
                .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_TYPING, result);
        }
    }
    async handleMessageEvent(data, client) {
        const result = await this.chatService.sendMessage(data, client.id);
        if (result.error) {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
        else {
            this.server
                .of(config_local_1.socketConfigs.socketNameSpace)
                .in(result.room_id.toString())
                .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_NEW_MESSAGE, result);
        }
    }
    async handleOpenMessageEvent(data, client) {
        const result = await this.chatService.openMessage(data, client.id);
        if (result.error) {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
        else {
            if (result.length > 0) {
                this.server
                    .of(config_local_1.socketConfigs.socketNameSpace)
                    .in(result[0].room_id.toString())
                    .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_UPDATE_MESSAGE, result);
            }
        }
    }
    async handleDeleteMessageEvent(data, client) {
        const result = await this.chatService.deleteMessage(data, client.id);
        this.consoleError(result);
        if (result.error) {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
        else {
            this.server
                .of(config_local_1.socketConfigs.socketNameSpace)
                .in(result.room_id.toString())
                .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE, result.message_id);
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE, result.message_id);
            this.consoleLog("room_id: %s, message_id: %s", result.room_id, result.message_id);
        }
    }
    handleLogoutEvent(data, client) {
        const result = this.chatService.logout(data, client.id);
        if (class_validator_1.isArray(result) && result.length > 0) {
            result.forEach((user) => {
                client.leave(user.room_id.toString());
                this.server
                    .of(config_local_1.socketConfigs.socketNameSpace)
                    .in(user.room_id.toString())
                    .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
                this.onlineService.removeUser(user.room_id, user.token);
            });
        }
        else {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
    }
    handleDisconnectEvent(client) {
        const result = this.chatService.disconnect(client.id);
        if (class_validator_1.isArray(result) && result.length > 0) {
            result.forEach((user) => {
                client.leave(user.room_id.toString());
                this.server
                    .of(config_local_1.socketConfigs.socketNameSpace)
                    .in(user.room_id.toString())
                    .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
                this.onlineService.removeUser(user.room_id, user.token);
            });
        }
        else {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
    }
    handleDisconnect(client) {
        const result = this.chatService.disconnect(client.id);
        if (class_validator_1.isArray(result) && result.length > 0) {
            result.forEach((user) => {
                client.leave(user.room_id.toString());
                this.server
                    .of(config_local_1.socketConfigs.socketNameSpace)
                    .in(user.room_id.toString())
                    .emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
                this.onlineService.removeUser(user.room_id, user.token);
            });
        }
        else {
            client.emit(const_1.m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
                code: result.error,
            });
        }
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_LOGIN),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLoginEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_SEND_TYPING),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_SEND_MESSAGE),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_OPEN_MESSAGE),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleOpenMessageEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeleteMessageEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_LOGOUT),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLogoutEvent", null);
__decorate([
    websockets_1.SubscribeMessage(const_1.m_constants.SOCKET_EVENTS.SOCKET_DISCONNECT),
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnectEvent", null);
ChatGateway = __decorate([
    websockets_1.WebSocketGateway({ cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        online_service_1.OnlineService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map