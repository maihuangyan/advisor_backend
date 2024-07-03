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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
let RoomService = class RoomService extends base_service_1.BaseService {
    constructor(mRepository) {
        super();
        this.mRepository = mRepository;
    }
    async createIfNotExist(createRoomDto) {
        const { advisor_id, client_id } = createRoomDto;
        this.consoleLog("createRoomDto", createRoomDto);
        const room = await this.findByAdvisorAndClient(advisor_id, client_id);
        if (room) {
            return room;
        }
        else {
            return await this.create(createRoomDto);
        }
    }
    async create(createRoomDto) {
        const newRoom = new room_entity_1.Room();
        newRoom.advisor_id = createRoomDto.advisor_id;
        newRoom.client_id = createRoomDto.client_id;
        newRoom.client_name = createRoomDto.client_name;
        newRoom.client_photo = createRoomDto.client_photo
            ? createRoomDto.client_photo
            : "";
        const errors = await class_validator_1.validate(newRoom);
        this.consoleLog("errors", errors);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const savedItem = await this.mRepository.save(newRoom);
        return { room: savedItem };
    }
    async findAll() {
        return await this.mRepository.find();
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async findByAdvisorAndClient(advisor_id, client_id) {
        const rooms = await this.mRepository.find({ advisor_id, client_id });
        if (rooms.length > 0) {
            return rooms[0];
        }
        else {
            return null;
        }
    }
    async findById(id) {
        return await this.mRepository.findOne(id);
    }
    async findRooms(client_ids) {
        const qb = this.mRepository
            .createQueryBuilder()
            .where("client_id IN (:...client_ids)", { client_ids });
        return await qb.getMany();
    }
    async findAdvisorRooms(advisor_id) {
        return (await this.mRepository.find({ advisor_id }));
    }
    async findClientRooms(client_id) {
        return (await this.mRepository.find({ client_id }));
    }
    async update(id, dto) {
        const room = await this.findOne(id);
        room.advisor_id = dto.advisor_id;
        room.client_id = dto.client_id;
        room.client_name = dto.client_name;
        room.client_photo = dto.client_photo;
        return await this.mRepository.save(room);
    }
    async remove(id) {
        await this.mRepository.delete(id);
    }
    async removeAdvisorRooms(advisor_id) {
        await this.mRepository
            .createQueryBuilder()
            .delete()
            .where("advisor_id = :advisor_id", { advisor_id })
            .execute();
    }
};
RoomService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map