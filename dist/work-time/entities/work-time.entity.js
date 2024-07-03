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
exports.WorkTime = void 0;
const typeorm_1 = require("typeorm");
const create_work_time_dto_1 = require("../dto/create-work-time.dto");
let WorkTime = class WorkTime {
    constructor(dto) {
        if (!dto)
            return;
        this.user_id = dto.user_id;
        this.start = dto.start;
        this.end = dto.end;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], WorkTime.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], WorkTime.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], WorkTime.prototype, "start", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], WorkTime.prototype, "end", void 0);
WorkTime = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_work_time_dto_1.CreateWorkTimeDto])
], WorkTime);
exports.WorkTime = WorkTime;
//# sourceMappingURL=work-time.entity.js.map