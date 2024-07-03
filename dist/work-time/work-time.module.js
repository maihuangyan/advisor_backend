"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkTimeModule = void 0;
const common_1 = require("@nestjs/common");
const work_time_service_1 = require("./work-time.service");
const work_time_controller_1 = require("./work-time.controller");
const typeorm_1 = require("@nestjs/typeorm");
const work_time_entity_1 = require("./entities/work-time.entity");
let WorkTimeModule = class WorkTimeModule {
};
WorkTimeModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([work_time_entity_1.WorkTime])],
        controllers: [work_time_controller_1.WorkTimeController],
        providers: [work_time_service_1.WorkTimeService],
        exports: [work_time_service_1.WorkTimeService],
    })
], WorkTimeModule);
exports.WorkTimeModule = WorkTimeModule;
//# sourceMappingURL=work-time.module.js.map