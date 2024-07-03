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
exports.EmailAttachmentController = void 0;
const common_1 = require("@nestjs/common");
const email_attachment_service_1 = require("./email-attachment.service");
const create_email_attachment_dto_1 = require("./dto/create-email-attachment.dto");
const update_email_attachment_dto_1 = require("./dto/update-email-attachment.dto");
let EmailAttachmentController = class EmailAttachmentController {
    constructor(emailAttachmentService) {
        this.emailAttachmentService = emailAttachmentService;
    }
    create(createEmailAttachmentDto) {
        return this.emailAttachmentService.create(createEmailAttachmentDto);
    }
    findAll() {
        return this.emailAttachmentService.findAll();
    }
    findOne(id) {
        return this.emailAttachmentService.findOne(+id);
    }
    update(id, updateEmailAttachmentDto) {
        return this.emailAttachmentService.update(+id, updateEmailAttachmentDto);
    }
    remove(id) {
        return this.emailAttachmentService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_email_attachment_dto_1.CreateEmailAttachmentDto]),
    __metadata("design:returntype", void 0)
], EmailAttachmentController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmailAttachmentController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailAttachmentController.prototype, "findOne", null);
__decorate([
    common_1.Patch(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_email_attachment_dto_1.UpdateEmailAttachmentDto]),
    __metadata("design:returntype", void 0)
], EmailAttachmentController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailAttachmentController.prototype, "remove", null);
EmailAttachmentController = __decorate([
    common_1.Controller('email-attachment'),
    __metadata("design:paramtypes", [email_attachment_service_1.EmailAttachmentService])
], EmailAttachmentController);
exports.EmailAttachmentController = EmailAttachmentController;
//# sourceMappingURL=email-attachment.controller.js.map