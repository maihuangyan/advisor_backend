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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const const_1 = require("../utils/const");
const utils_1 = require("../utils/utils");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const room_service_1 = require("../room/room.service");
const online_service_1 = require("../online/online.service");
const client_service_1 = require("../client/client.service");
const role_enum_1 = require("../guards/enum/role.enum");
const user_service_1 = require("../user/user.service");
const update_room_dto_1 = require("../room/dto/update-room.dto");
const config_local_1 = require("../utils/config_local");
const connection_service_1 = require("../connection/connection.service");
let MessageService = class MessageService extends base_service_1.BaseService {
    constructor(mRepository, roomService, onlineService, clientService, userService, connectionService) {
        super();
        this.mRepository = mRepository;
        this.roomService = roomService;
        this.onlineService = onlineService;
        this.clientService = clientService;
        this.userService = userService;
        this.connectionService = connectionService;
    }
    async create(createMessageDto) {
        const newMessage = new message_entity_1.Message();
        newMessage.local_id = createMessageDto.local_id;
        newMessage.room_id = createMessageDto.room_id;
        newMessage.user_id = createMessageDto.user_id;
        newMessage.message = createMessageDto.message;
        newMessage.type = createMessageDto.type;
        newMessage.created_at = utils_1.now();
        newMessage.updated_at = utils_1.now();
        const errors = await class_validator_1.validate(newMessage);
        if (errors.length > 0) {
            this.consoleLog("errors", errors);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        return await this.mRepository.save(newMessage);
    }
    findAll() {
        return `This action returns all message`;
    }
    async findRoomsWithMessages(advisor_id) {
        const getRoomsOnlineStatus = this.onlineService.getAdvisorRoomsOnlineStatus(advisor_id);
        const result = [];
        const connections = await this.connectionService.advisor_connections(advisor_id);
        const clientEmails = [];
        for (const con of connections) {
            clientEmails.push(con.client_email);
        }
        const rooms = await this.roomService.findRooms(clientEmails);
        for (const room of rooms) {
            const messages = await this.findRoomMessages(`${room.id}`, 0, 50, role_enum_1.Role.Advisor);
            room.status = getRoomsOnlineStatus[room.id];
            result.push({ room: room, messages: messages });
        }
        return result;
    }
    async findRoomMessages(room_id, offset, limit, caller) {
        let cleared_query = "";
        if (caller == role_enum_1.Role.Advisor) {
            cleared_query = " and advisor_deleted = 0";
        }
        else if (caller == role_enum_1.Role.User) {
            cleared_query = " and client_deleted = 0";
        }
        const qb = this.mRepository
            .createQueryBuilder()
            .where("room_id = :room_id" + cleared_query, { room_id })
            .orderBy("id", "DESC")
            .limit(limit)
            .offset(offset);
        return await qb.getMany();
    }
    async findRoomLastMessages(email, room_id, last_message_id, caller) {
        let cleared_query = "";
        if (caller == role_enum_1.Role.Advisor) {
            cleared_query = " and advisor_deleted = 0";
        }
        else if (caller == role_enum_1.Role.User) {
            const room = await this.roomService.findById(+room_id);
            if (room.client_id != email) {
                return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidRoom };
            }
            if (room) {
                const advisor = await this.userService.findOne(+room.advisor_id);
                if (!advisor) {
                    return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
                }
                if (advisor.status !== 1) {
                    return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
                }
            }
            else {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
            }
            cleared_query = " and client_deleted = 0";
        }
        const qb = this.mRepository
            .createQueryBuilder()
            .where("room_id = :room_id" + cleared_query, { room_id })
            .andWhere("id > :last_message_id", { last_message_id });
        const messages = await qb.getMany();
        return messages;
    }
    async getAdvisorUnreadMessages(advisor_id) {
        const connections = await this.connectionService.advisor_connections(advisor_id);
        const clientEmails = [];
        for (const con of connections) {
            clientEmails.push(con.client_email);
        }
        const rooms = await this.roomService.findRooms(clientEmails);
        if (rooms.length == 0) {
            return [];
        }
        const room_ids = [];
        for (const room of rooms) {
            room_ids.push(room.id);
        }
        const qb = this.mRepository
            .createQueryBuilder("message")
            .where("message.room_id IN (:...room_ids)", { room_ids })
            .andWhere("message.user_id <> :advisor_id", { advisor_id })
            .andWhere("message.advisor_deleted = 0")
            .andWhere("message.seen_status = 0")
            .andWhere("message.status = 1");
        const messages = await qb.getMany();
        const clients = await this.clientService.findAll();
        const clientsWithMessages = {};
        for (const message of messages) {
            const client = this.findClient(clients, message.user_id);
            if (client) {
                if (clientsWithMessages[client.email]) {
                    clientsWithMessages[client.email]["messages"].push(message);
                }
                else {
                    client["messages"] = [message];
                    clientsWithMessages[client.email] = client;
                }
            }
        }
        return Object.values(clientsWithMessages);
    }
    findClient(clients, email) {
        for (const client of clients) {
            if (client.email == email) {
                return client;
            }
        }
        return null;
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async update(id, dto) {
        const message = await this.mRepository.findOne(id);
        if (message) {
            message.message = dto.message ? dto.message : message.message;
            message.deleted_at = dto.deleted_at ? dto.deleted_at : message.deleted_at;
            message.advisor_deleted =
                dto.advisor_deleted == -1
                    ? message.advisor_deleted
                    : dto.advisor_deleted;
            message.client_deleted =
                dto.client_deleted == -1 ? message.client_deleted : dto.client_deleted;
            message.updated_at = utils_1.now();
        }
        return await this.mRepository.save(message);
    }
    async clearRoomMessages(user, room_id, role) {
        const room = await this.roomService.findById(+room_id);
        if (!room) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidRoom };
        }
        if (room.advisor_id != user.id && room.client_id != user.email) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
        }
        this.consoleLog(room_id);
        let data = {};
        if (role == role_enum_1.Role.Advisor) {
            data = {
                advisor_deleted: 1,
            };
        }
        else if (role == role_enum_1.Role.User) {
            data = {
                client_deleted: 1,
            };
        }
        else {
            data = {
                advisor_deleted: 1,
                client_deleted: 1,
            };
        }
        return await this.mRepository
            .createQueryBuilder()
            .update(message_entity_1.Message)
            .set(data)
            .where("room_id = :room_id", { room_id })
            .execute();
    }
    async clearAdvisorMessages(advisor_id, client_id) {
        const room = await this.roomService.findByAdvisorAndClient(advisor_id, client_id);
        this.consoleLog(room);
        if (!room) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInactiveUser };
        }
        return await this.mRepository
            .createQueryBuilder()
            .update(message_entity_1.Message)
            .set({ advisor_deleted: 1 })
            .where("room_id = :room_id", { room_id: room.id })
            .execute();
    }
    async clearClientMessages(client_id) {
        this.consoleLog(client_id);
        const rooms = await this.roomService.findClientRooms(client_id);
        if (rooms.length > 0) {
            const room_ids = rooms.map((room) => room.id);
            return await this.mRepository
                .createQueryBuilder()
                .update(message_entity_1.Message)
                .set({ client_deleted: 1 })
                .where("room_id in (:...room_ids)", { room_ids })
                .execute();
        }
        return true;
    }
    async addSeen(id) {
        const result = await this.mRepository
            .createQueryBuilder()
            .update(message_entity_1.Message)
            .set({
            updated_at: utils_1.now(),
            seen_status: 1,
        })
            .where("id = :id", { id })
            .execute();
        this.consoleLog(result);
        return await this.findOne(id);
    }
    async remove(id) {
        await this.mRepository.delete(id);
    }
    async updateRoomsWithClientPhoto() {
        const rooms = await this.roomService.findAll();
        rooms.map(async (item) => {
            const dto = new update_room_dto_1.UpdateRoomDto();
            dto.advisor_id = item.advisor_id;
            dto.client_id = item.client_id;
            dto.client_name = item.client_name;
            const client = await this.clientService.findOneByEmail(item.client_id);
            if (client)
                dto.client_photo = config_local_1.urls.GS_MAIN_API_BASE_URL + 'nexerone/getProfileImage?user_id=' + client.customer_id;
            await this.roomService.update(item.id, dto);
        });
        return true;
    }
};
MessageService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        room_service_1.RoomService,
        online_service_1.OnlineService,
        client_service_1.ClientService,
        user_service_1.UserService,
        connection_service_1.ConnectionService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map