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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const roles_decorator_1 = require("../guards/roles.decorator");
const base_controller_1 = require("../_base/base.controller");
const create_email_dto_1 = require("./dto/create-email.dto");
const email_service_1 = require("./email.service");
let EmailController = class EmailController extends base_controller_1.BaseController {
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async create(req, files, dto) {
        dto.from = req.user.vmail;
        return this.response(await this.emailService.create(req.user.id, files, dto));
    }
    async getInbox(req) {
        const vmail = req.user.vmail;
        return this.response(await this.emailService.getInbox(vmail));
    }
    async getContent(mailId) {
        return this.response(await this.emailService.getContent(+mailId));
    }
    async getSent(req) {
        const vmail = req.user.vmail;
        return this.response(await this.emailService.getSent(vmail));
    }
    async getDrafts(req) {
        const vmail = req.user.vmail;
        return this.response(await this.emailService.getDrafts(vmail));
    }
    async getDeleted(req) {
        const vmail = req.user.vmail;
        return this.response(await this.emailService.getTrash(vmail));
    }
    async saveDraft(req, files, dto) {
        dto.from = req.user.vmail;
        return this.response(await this.emailService.saveDraft(req.user.id, files, dto));
    }
    async sendDraft(mailId) {
        return this.response(await this.emailService.sendDraft(mailId));
    }
    async setReadUnread(mailId, data) {
        return this.response(await this.emailService.setReadUnread(mailId, data.status));
    }
    async deleteOrPurge(mailId) {
        return this.response(await this.emailService.trashOrDelete(+mailId));
    }
    async trash(mailId) {
        return this.response(await this.emailService.trash(+mailId));
    }
    async delete(mailId) {
        return this.response(await this.emailService.delete(+mailId));
    }
    async restore(req, mailId) {
        const vmail = req.user.vmail;
        return this.response(await this.emailService.restore(vmail, +mailId));
    }
    async moveToTrash(param) {
        return this.response(await this.emailService.trashMany(param.email_ids));
    }
    async deleteMany(param) {
        return this.response(await this.emailService.deleteMany(param.email_ids));
    }
    async uploadFile(files) {
        return await this.emailService.saveAttachments(files);
    }
    getFile(filename, res) {
        return res.sendFile(filename, { root: "uploads/files" });
    }
};
__decorate([
    common_1.Post("send"),
    common_1.UseInterceptors(platform_express_1.AnyFilesInterceptor()),
    __param(0, common_1.Request()),
    __param(1, common_1.UploadedFiles()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, create_email_dto_1.CreateEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "create", null);
__decorate([
    common_1.Get("inbox"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getInbox", null);
__decorate([
    common_1.Get("view/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getContent", null);
__decorate([
    common_1.Get("sent"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getSent", null);
__decorate([
    common_1.Get("draft"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getDrafts", null);
__decorate([
    common_1.Get("trash"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "getDeleted", null);
__decorate([
    common_1.Post("save-draft"),
    common_1.UseInterceptors(platform_express_1.AnyFilesInterceptor()),
    __param(0, common_1.Request()),
    __param(1, common_1.UploadedFiles()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, create_email_dto_1.CreateEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "saveDraft", null);
__decorate([
    common_1.Post("send-draft/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendDraft", null);
__decorate([
    common_1.Post("set-read-unread/:id"),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "setReadUnread", null);
__decorate([
    common_1.Get("trash-or-delete/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "deleteOrPurge", null);
__decorate([
    common_1.Get("trash/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "trash", null);
__decorate([
    common_1.Get("delete/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "delete", null);
__decorate([
    common_1.Get("restore/:id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "restore", null);
__decorate([
    common_1.Post("trash-many"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "moveToTrash", null);
__decorate([
    common_1.Post("delete-many"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "deleteMany", null);
__decorate([
    common_1.Post("upload"),
    common_1.UseInterceptors(platform_express_1.AnyFilesInterceptor()),
    __param(0, common_1.UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "uploadFile", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("attachment/:filename"),
    __param(0, common_1.Param("filename")),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmailController.prototype, "getFile", null);
EmailController = __decorate([
    common_1.Controller("email"),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
exports.EmailController = EmailController;
//# sourceMappingURL=email.controller.js.map