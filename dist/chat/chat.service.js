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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const online_service_1 = require("../online/online.service");
const auth_service_1 = require("../auth/auth.service");
const room_service_1 = require("../room/room.service");
const message_service_1 = require("../message/message.service");
const const_1 = require("../utils/const");
const create_message_dto_1 = require("../message/dto/create-message.dto");
const class_validator_1 = require("class-validator");
const role_enum_1 = require("../guards/enum/role.enum");
const connection_service_1 = require("../connection/connection.service");
const client_service_1 = require("../client/client.service");
const base_service_1 = require("../_base/base.service");
const message_entity_1 = require("../message/entities/message.entity");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const user_service_1 = require("../user/user.service");
let ChatService = class ChatService extends base_service_1.BaseService {
    constructor(authService, onlineService, roomService, messageService, connectionService, userService, clientService, nexeroneService) {
        super();
        this.authService = authService;
        this.onlineService = onlineService;
        this.roomService = roomService;
        this.messageService = messageService;
        this.connectionService = connectionService;
        this.userService = userService;
        this.clientService = clientService;
        this.nexeroneService = nexeroneService;
    }
    async login(param, socket_id) {
        if (!param.token) {
            this.consoleError(const_1.m_constants.RESPONSE_ERROR.resCodeNoToken);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const auth = await this.authService.verifyToken(param.token);
        if (auth.error) {
            return auth;
        }
        else {
            if (auth.user.role == role_enum_1.Role.Advisor) {
                param.user_id = auth.user.id;
                const advisorRooms = await this.roomService.findAdvisorRooms(auth.user.id);
                const room_ids = [];
                advisorRooms.forEach((room) => {
                    room_ids.push("" + room.id);
                });
                param.room_ids = room_ids;
            }
            else if (auth.user.role == role_enum_1.Role.User) {
                const connection = await this.connectionService.findByClientEmail(auth.user.email);
                if (!connection) {
                    return {
                        error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketNoAdvisor,
                    };
                }
                param.advisor_id = connection.advisor_id;
                param.user_id = auth.user.email;
                const room = await this.roomService.findByAdvisorAndClient(param.advisor_id, param.user_id);
                if (!room) {
                    return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
                }
                else {
                    param.socket_id = socket_id;
                    param.room_id = "" + room.id;
                }
                const advisor = await this.userService.findOne(param.advisor_id);
                if (!advisor) {
                    return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
                }
                if (advisor.status !== 1) {
                    return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
                }
            }
            return param;
        }
    }
    async typing(param, socket_id) {
        if (!param.token) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const mUser = this.onlineService.getUserByToken(param.token);
        if (!mUser) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
        }
        if (!param.room_id) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketTypingNoRoomID,
            };
        }
        const room = await this.roomService.findById(param.room_id);
        if (!room) {
            this.onlineService.removeRoom(param.room_id);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
        }
        const advisor = await this.userService.findOne(room.advisor_id);
        if (!advisor) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        if (param.type != 0 && param.type != 1) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketTypingNoType,
            };
        }
        param.user_id = mUser.user_id;
        return param;
    }
    async sendMessage(param, socket_id) {
        if (!param.token) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const rooms = this.onlineService.getRoomIDsByUser(param.token);
        if (rooms.length < 1) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
        }
        if (!param.room_id) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoRoomID,
            };
        }
        const room = await this.roomService.findById(param.room_id);
        if (!room) {
            this.onlineService.removeRoom(param.room_id);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
        }
        const advisor = await this.userService.findOne(room.advisor_id);
        if (!advisor) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        if (!param.type) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoType,
            };
        }
        if (!param.message) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoMessage,
            };
        }
        const sender = this.onlineService.getUserByToken(param.token);
        if (!sender || !sender.user_id) {
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageInvalidUser,
            };
        }
        const message = param.message.replace(/^\s*$(?:\r\n?|\n)/gm, "");
        const newMessage = new create_message_dto_1.CreateMessageDto(param.room_id, sender.user_id, param.local_id, message, param.type);
        const uMessage = await this.messageService.create(newMessage);
        if (uMessage.error) {
            this.consoleError(param);
            return uMessage;
        }
        else {
            uMessage.seen_status = 0;
            if (("" + sender.user_id).includes("@")) {
                uMessage.client = this.clientService.addUserFields(await this.clientService.findOneByEmail(sender.user_id));
            }
            if (sender.user_id && ("" + sender.user_id).includes("@")) {
                return uMessage;
            }
            const room = await this.roomService.findOne(+param.room_id);
            if (!room || !room.client_id) {
                return {
                    error: const_1.m_constants.RESPONSE_SOCKET_ERROR
                        .resCodeSocketSendMessageInvalidRoom,
                };
            }
            let pushUser = room.client_id;
            const roomUsers = this.onlineService.getRoom(param.room_id);
            for (const roomUser of roomUsers.users) {
                if (pushUser == roomUser.user_id) {
                    pushUser = null;
                    break;
                }
            }
            this.sendPushNotification(pushUser, uMessage);
            return uMessage;
        }
    }
    sendPushNotification(clientEmail, message) {
        if (clientEmail && message && message.message) {
            this.nexeroneService.sendPushNotification(clientEmail, `Your advisor sent a new message`, message.message);
        }
    }
    async openMessage(param, socket_id) {
        if (!param.token) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const rooms = this.onlineService.getRoomIDsByUser(param.token);
        if (rooms.length < 1) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
        }
        if (!param.message_ids ||
            !class_validator_1.isArray(param.message_ids) ||
            param.message_ids.length < 1) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketOpenMessageNoMessageID,
            };
        }
        const updatedMessages = [];
        for (const messageID of param.message_ids) {
            if (messageID) {
                try {
                    const message = await this.messageService.addSeen(messageID);
                    if (message) {
                        updatedMessages.push(message);
                    }
                    else {
                        this.consoleLog("Invalid message id");
                    }
                }
                catch (ex) {
                    this.consoleError(ex);
                }
            }
        }
        return updatedMessages;
    }
    async deleteMessage(param, socket_id) {
        this.consoleLog(socket_id);
        if (!param.token) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const rooms = this.onlineService.getRoomIDsByUser(param.token);
        if (rooms.length < 1) {
            this.consoleError(param);
            return { code: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
        }
        if (!param.room_id) {
            this.consoleError(param);
            return {
                error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketDeleteMessageNoRoomID,
            };
        }
        const room = await this.roomService.findById(param.room_id);
        if (!room) {
            this.onlineService.removeRoom(param.room_id);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
        }
        const advisor = await this.userService.findOne(room.advisor_id);
        if (!advisor) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        if (!param.message_id) {
            this.consoleError(param);
            return {
                code: const_1.m_constants.RESPONSE_SOCKET_ERROR
                    .resCodeSocketDeleteMessageNoMessageID,
            };
        }
        try {
            await this.messageService.remove(+param.message_id);
            return param;
        }
        catch (err) {
            this.consoleError(err);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeDatabaseError };
        }
    }
    logout(param, socket_id) {
        if (!param || !param.token) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken };
        }
        const rooms = this.onlineService.getRoomsByUser(param.token);
        if (rooms.length < 1) {
            this.consoleError(param);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
        }
        const result = [];
        rooms.forEach((room) => {
            let mUser = null;
            let sameUserCount = 0;
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.token == param.token) {
                    sameUserCount++;
                    mUser = user;
                }
            }
            if (mUser) {
                mUser.same_accounts = sameUserCount;
                result.push(mUser);
            }
        });
        return result;
    }
    disconnect(socket_id) {
        const rooms = this.onlineService.getRoomsBySocketID(socket_id);
        if (rooms.length < 1) {
            this.consoleError(socket_id);
            return { error: const_1.m_constants.RESPONSE_SOCKET_ERROR.resCodeInvalidSocket };
        }
        const result = [];
        rooms.forEach((room) => {
            let mUser = null;
            let sameUserCount = 0;
            for (let i = 0; i < room.users.length; i++) {
                const user = room.users[i];
                if (user.socket_id == socket_id) {
                    sameUserCount++;
                    mUser = user;
                }
            }
            if (mUser) {
                mUser.same_accounts = sameUserCount;
                result.push(mUser);
            }
        });
        return result;
    }
};
ChatService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        online_service_1.OnlineService,
        room_service_1.RoomService,
        message_service_1.MessageService,
        connection_service_1.ConnectionService,
        user_service_1.UserService,
        client_service_1.ClientService,
        nexerone_service_1.NexeroneService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map