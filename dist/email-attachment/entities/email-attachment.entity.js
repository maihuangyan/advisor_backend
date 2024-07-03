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
exports.EmailAttachment = void 0;
const typeorm_1 = require("typeorm");
const email_entity_1 = require("../../email/entities/email.entity");
const create_email_attachment_dto_1 = require("../dto/create-email-attachment.dto");
let EmailAttachment = class EmailAttachment {
    constructor(dto) {
        if (!dto)
            return;
        this.filename = dto.filename;
        this.origin_filename = dto.originalname;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], EmailAttachment.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => email_entity_1.Email, (email) => email.attachments, { nullable: true }),
    __metadata("design:type", email_entity_1.Email)
], EmailAttachment.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], EmailAttachment.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], EmailAttachment.prototype, "origin_filename", void 0);
EmailAttachment = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_email_attachment_dto_1.CreateEmailAttachmentDto])
], EmailAttachment);
exports.EmailAttachment = EmailAttachment;
//# sourceMappingURL=email-attachment.entity.js.map