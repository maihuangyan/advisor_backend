"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAttachmentModule = void 0;
const common_1 = require("@nestjs/common");
const email_attachment_service_1 = require("./email-attachment.service");
const email_attachment_controller_1 = require("./email-attachment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const email_attachment_entity_1 = require("./entities/email-attachment.entity");
let EmailAttachmentModule = class EmailAttachmentModule {
};
EmailAttachmentModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_attachment_entity_1.EmailAttachment])
        ],
        controllers: [email_attachment_controller_1.EmailAttachmentController],
        providers: [email_attachment_service_1.EmailAttachmentService],
        exports: [email_attachment_service_1.EmailAttachmentService]
    })
], EmailAttachmentModule);
exports.EmailAttachmentModule = EmailAttachmentModule;
//# sourceMappingURL=email-attachment.module.js.map