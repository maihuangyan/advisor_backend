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
exports.Email = void 0;
const email_attachment_entity_1 = require("../../email-attachment/entities/email-attachment.entity");
const typeorm_1 = require("typeorm");
let Email = class Email {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Email.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Email.prototype, "message_id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Email.prototype, "flags", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Email.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Email.prototype, "from", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Email.prototype, "to", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Email.prototype, "subject", void 0);
__decorate([
    typeorm_1.Column({ type: "longtext", default: null }),
    __metadata("design:type", String)
], Email.prototype, "text", void 0);
__decorate([
    typeorm_1.Column({ type: "longtext", default: "" }),
    __metadata("design:type", String)
], Email.prototype, "textAsHtml", void 0);
__decorate([
    typeorm_1.Column({ type: "longtext", default: "" }),
    __metadata("design:type", String)
], Email.prototype, "html", void 0);
__decorate([
    typeorm_1.Column({ default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Email.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Email.prototype, "mailbox", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Email.prototype, "reply_on", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Email.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Email.prototype, "deleted_at", void 0);
__decorate([
    typeorm_1.OneToMany(() => email_attachment_entity_1.EmailAttachment, (attachment) => attachment.email),
    __metadata("design:type", Array)
], Email.prototype, "attachments", void 0);
__decorate([
    typeorm_1.Column({ type: "tinyint", width: 1, default: 0 }),
    __metadata("design:type", Number)
], Email.prototype, "status", void 0);
Email = __decorate([
    typeorm_1.Entity()
], Email);
exports.Email = Email;
//# sourceMappingURL=email.entity.js.map