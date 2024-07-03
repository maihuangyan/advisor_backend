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
exports.WorkTimeController = void 0;
const common_1 = require("@nestjs/common");
const work_time_service_1 = require("./work-time.service");
const create_work_time_dto_1 = require("./dto/create-work-time.dto");
const update_work_time_dto_1 = require("./dto/update-work-time.dto");
const base_controller_1 = require("../_base/base.controller");
const roles_guard_1 = require("../guards/roles.guard");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
let WorkTimeController = class WorkTimeController extends base_controller_1.BaseController {
    constructor(workTimeService) {
        super();
        this.workTimeService = workTimeService;
    }
    async create(dto) {
        return this.response(await this.workTimeService.create(dto));
    }
    async setWorkTimes(data) {
        return this.response(await this.workTimeService.setWorkTimes(data));
    }
    async find(advisor_id) {
        return this.response(await this.workTimeService.find(+advisor_id));
    }
    update(id, dto) {
        return this.workTimeService.update(+id, dto);
    }
    remove(id) {
        return this.workTimeService.remove(+id);
    }
};
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_work_time_dto_1.CreateWorkTimeDto]),
    __metadata("design:returntype", Promise)
], WorkTimeController.prototype, "create", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Post("set_work_times"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkTimeController.prototype, "setWorkTimes", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkTimeController.prototype, "find", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_work_time_dto_1.UpdateWorkTimeDto]),
    __metadata("design:returntype", void 0)
], WorkTimeController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkTimeController.prototype, "remove", null);
WorkTimeController = __decorate([
    common_1.Controller("work-time"),
    __metadata("design:paramtypes", [work_time_service_1.WorkTimeService])
], WorkTimeController);
exports.WorkTimeController = WorkTimeController;
//# sourceMappingURL=work-time.controller.js.map