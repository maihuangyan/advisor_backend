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
exports.ConnectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const auth_service_1 = require("../auth/auth.service");
const client_service_1 = require("../client/client.service");
const create_client_dto_1 = require("../client/dto/create-client.dto");
const client_entity_1 = require("../client/entities/client.entity");
const role_enum_1 = require("../guards/enum/role.enum");
const online_service_1 = require("../online/online.service");
const create_room_dto_1 = require("../room/dto/create-room.dto");
const room_service_1 = require("../room/room.service");
const update_user_dto_1 = require("../user/dto/update-user.dto");
const user_service_1 = require("../user/user.service");
const const_1 = require("../utils/const");
const zoom_service_1 = require("../zoom/zoom.service");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const connection_entity_1 = require("./entities/connection.entity");
let ConnectionService = class ConnectionService extends base_service_1.BaseService {
    constructor(mRepository, clientService, authService, userService, onlineService, roomService, zoomService) {
        super();
        this.mRepository = mRepository;
        this.clientService = clientService;
        this.authService = authService;
        this.userService = userService;
        this.onlineService = onlineService;
        this.roomService = roomService;
        this.zoomService = zoomService;
    }
    async create(dto, triedSaveClient = false) {
        const connection = await this.findByClientEmail(dto.client_email);
        if (connection) {
            this.consoleLog(dto);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeAlreadyConnected };
        }
        const advisor = await this.userService.findOne(dto.advisor_id);
        if (!advisor) {
            this.consoleLog(dto);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        if (advisor.email == dto.client_email) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailSameAdvisor };
        }
        const client = await this.clientService.loadAndRegister(dto.client_email);
        if (client.error) {
            return client;
        }
        if (client) {
            const newConnection = new connection_entity_1.Connection(dto);
            newConnection.client_id = client.id;
            const errors = await class_validator_1.validate(newConnection);
            this.consoleLog(errors);
            if (errors.length > 0) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
            }
            else {
                this.roomService.createIfNotExist(new create_room_dto_1.CreateRoomDto(dto.advisor_id, client.email, client.fullName, client.avatar));
                const save = await this.mRepository.save(newConnection);
                return { connection: save, client: client };
            }
        }
        else {
            if (triedSaveClient) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeDatabaseError };
            }
            return await this.create(dto, true);
        }
    }
    async advisor_clients(displayCurrency, advisor_id) {
        const client_ids = [];
        const connections = await this.mRepository.find({ advisor_id });
        connections.forEach((connection) => {
            client_ids.push(connection.client_id);
        });
        if (client_ids.length > 0) {
            return await this.clientService.find_clients(displayCurrency, client_ids);
        }
        else {
            return { total: 0, clients: [], allData: [] };
        }
    }
    async advisor_connections(advisor_id) {
        return await this.mRepository.find({ advisor_id });
    }
    async advisor_overview(displayCurrency, advisor_id, advisor_email, refresh) {
        const connections = await this.mRepository.find({ advisor_id });
        const client_emails = [];
        connections.forEach((connection) => {
            client_emails.push(connection.client_email);
        });
        if (client_emails.length > 0) {
            return await this.clientService.advisor_overview(displayCurrency, client_emails, refresh);
        }
        else {
            return [];
        }
    }
    async find(advisor_id, page, limit, status, search_key, displayCurrency) {
        const client_ids = [];
        const connections = await this.mRepository.find({ advisor_id });
        connections.forEach((connection) => {
            client_ids.push(connection.client_id);
        });
        if (client_ids.length > 0) {
            return await this.clientService.find(client_ids, page, limit, status, search_key, displayCurrency);
        }
        else {
            return { total: 0, clients: [], allData: [] };
        }
    }
    async updateClientFees(data) {
        return await this.clientService.updateClientFees(data);
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async findAdvisorConnections(advisor_id) {
        return await this.mRepository.find({ advisor_id });
    }
    async findConnection(advisor_id, client_id) {
        return await this.mRepository.findOne({ advisor_id, client_id });
    }
    async findByClient(token) {
        const client = await this.clientService.loadAndRegisterBytoken(token);
        if (client.error) {
            return client;
        }
        const connection = await this.findByClientEmail(client.email);
        if (!connection) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeUserNotFound };
        }
        const advisor = await this.userService.findAdvisor(connection.advisor_id);
        if (advisor.error) {
            return advisor;
        }
        if (advisor.status !== 1) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
        advisor.online = this.onlineService.getUserByUserID(advisor.id)
            ? "online"
            : "offline";
        advisor.advisor_service_token = this.authService.login({
            id: client.id,
            email: client.email,
            role: role_enum_1.Role.User,
        }).access_token;
        const room = await this.roomService.findByAdvisorAndClient(connection.advisor_id, client.email);
        advisor.room_id = room ? room.id : 0;
        advisor.email = advisor.vmail;
        return advisor;
    }
    async findByClientEmail(client_email) {
        return await this.mRepository.findOne({ client_email: client_email.toLowerCase() });
    }
    async update(id, dto) {
        const connection = await this.findOne(id);
        connection.advisor_id = dto.advisor_id;
        connection.client_email = dto.client_email.toLowerCase();
        return await this.mRepository.save(connection);
    }
    async remove(id) {
        return await this.mRepository.delete(id);
    }
    async removeConnection(advisor_id, client_id) {
        const client = await this.clientService.findOne(client_id);
        const room = await this.roomService.findByAdvisorAndClient(advisor_id, client.email);
        if (room) {
            this.roomService.remove(room.id);
        }
        const fee = {
            client_id,
            fee_bps_gold_coin: 0,
            fee_bps_gold_bar: 0,
            fee_bps_gold_storage: 0,
            fee_bps_silver_coin: 0,
            fee_bps_silver_bar: 0,
            fee_bps_silver_storage: 0,
        };
        await this.clientService.updateClientFees(fee);
        return await this.mRepository.delete({ advisor_id, client_id });
    }
    async deleteAdvisor(advisor_id) {
        await this.removeAdvisorConnections(advisor_id);
        return await this.userService.remove(advisor_id);
    }
    async removeAdvisorConnections(advisor_id) {
        await this.mRepository
            .createQueryBuilder()
            .delete()
            .where("advisor_id = :advisor_id", { advisor_id })
            .execute();
        await this.roomService.removeAdvisorRooms(advisor_id);
    }
};
ConnectionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(connection_entity_1.Connection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        client_service_1.ClientService,
        auth_service_1.AuthService,
        user_service_1.UserService,
        online_service_1.OnlineService,
        room_service_1.RoomService,
        zoom_service_1.ZoomService])
], ConnectionService);
exports.ConnectionService = ConnectionService;
//# sourceMappingURL=connection.service.js.map