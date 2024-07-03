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
exports.WorkTimeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const create_work_time_dto_1 = require("./dto/create-work-time.dto");
const work_time_entity_1 = require("./entities/work-time.entity");
let WorkTimeService = class WorkTimeService extends base_service_1.BaseService {
    constructor(mRepository) {
        super();
        this.mRepository = mRepository;
    }
    async create(dto) {
        const errors = await class_validator_1.validate(dto);
        this.consoleLog("errors", errors);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        if (dto.end <= dto.start || dto.end > 86400 || dto.start < 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        return await this.mRepository.save(new work_time_entity_1.WorkTime(dto));
    }
    async setWorkTimes(data) {
        if (!Number.isInteger(+data.start1) ||
            !Number.isInteger(+data.end1) ||
            !Number.isInteger(+data.start2) ||
            !Number.isInteger(+data.end2) ||
            +data.start1 < 0 ||
            +data.start1 > 86400 ||
            +data.start2 < 0 ||
            +data.start2 > 86400 ||
            +data.end1 < 0 ||
            +data.end1 > 86400 ||
            +data.end2 < 0 ||
            +data.end2 > 86400 ||
            +data.start1 >= +data.end1 ||
            +data.start2 >= +data.end2 ||
            (+data.start1 <= +data.start2 && +data.start2 <= +data.end1) ||
            (+data.start2 <= +data.start1 && +data.start1 <= +data.end2) ||
            (+data.start1 <= +data.end2 && +data.end2 <= +data.end1) ||
            (+data.start2 <= +data.end1 && +data.end1 <= +data.end2)) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const workTimes = await this.find(data.user_id);
        for (const workTime of workTimes) {
            await this.remove(workTime.id);
        }
        const result = [];
        result.push(await this.create(new create_work_time_dto_1.CreateWorkTimeDto(data.user_id, data.start1, data.end1)));
        result.push(await this.create(new create_work_time_dto_1.CreateWorkTimeDto(data.user_id, data.start2, data.end2)));
        return result;
    }
    async find(user_id) {
        if (isNaN(user_id)) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        return await this.mRepository.find({ user_id });
    }
    findOne(id) {
        return `This action returns a #${id} workTime`;
    }
    update(id, updateWorkTimeDto) {
        return `This action updates a #${id} workTime`;
    }
    remove(id) {
        return this.mRepository.delete(id);
    }
};
WorkTimeService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(work_time_entity_1.WorkTime)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkTimeService);
exports.WorkTimeService = WorkTimeService;
//# sourceMappingURL=work-time.service.js.map