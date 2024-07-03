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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
let Message = class Message {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "room_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "local_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 1 }),
    __metadata("design:type", Number)
], Message.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 13, default: "0" }),
    __metadata("design:type", String)
], Message.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 13, default: "0" }),
    __metadata("design:type", String)
], Message.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 13, default: "0" }),
    __metadata("design:type", String)
], Message.prototype, "deleted_at", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 1 }),
    __metadata("design:type", Number)
], Message.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 0 }),
    __metadata("design:type", Number)
], Message.prototype, "seen_status", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 0 }),
    __metadata("design:type", Number)
], Message.prototype, "advisor_deleted", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 4, default: 0 }),
    __metadata("design:type", Number)
], Message.prototype, "client_deleted", void 0);
Message = __decorate([
    typeorm_1.Entity()
], Message);
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map