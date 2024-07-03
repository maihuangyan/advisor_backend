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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const base_controller_1 = require("../_base/base.controller");
const platform_express_1 = require("@nestjs/platform-express");
const roles_decorator_1 = require("../guards/roles.decorator");
const config_local_1 = require("../utils/config_local");
const nexerone_service_1 = require("../nexerone/nexerone.service");
let MessageController = class MessageController extends base_controller_1.BaseController {
    constructor(messageService, nexeronService) {
        super();
        this.messageService = messageService;
        this.nexeronService = nexeronService;
    }
    create(createMessageDto) {
        return this.messageService.create(createMessageDto);
    }
    findAll() {
        return this.messageService.findAll();
    }
    async findRoomMessages(req, room_id, query) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
            }
        }
        const offset = query.offset;
        const limit = query.limit;
        const messages = await this.messageService.findRoomMessages(room_id, offset, limit, req.user.role);
        return this.response(messages);
    }
    async findRoomLastMessages(req, room_id, query) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
            }
        }
        const email = req.user.email;
        const message_id = query.last_message_id;
        const messages = await this.messageService.findRoomLastMessages(email, room_id, message_id, req.user.role);
        return this.response(messages);
    }
    async findAdvisorMessages(req) {
        const advisor_id = req.user.id;
        return this.response(await this.messageService.findRoomsWithMessages(advisor_id));
    }
    async advisorUnreadMessages(req) {
        const advisor_id = req.user.id;
        return this.response(await this.messageService.getAdvisorUnreadMessages(advisor_id));
    }
    async clearRoomMessages(req, room_id) {
        const clientToken = req.headers.accesstoken;
        if (clientToken) {
            const result = await this.nexeronService.verifyClientToken(clientToken);
            if (result.error) {
            }
        }
        return this.response(await this.messageService.clearRoomMessages(req.user, room_id, req.user.role));
    }
    async clearAdvisorMessages(req, client) {
        const advisor_id = req.user.id;
        return this.response(await this.messageService.clearAdvisorMessages(advisor_id, client.email));
    }
    async clearClientMessages(req) {
        const client_id = req.user.email;
        return this.response(await this.messageService.clearClientMessages(client_id));
    }
    uploadFile(file) {
        this.consoleLog(file);
        file["url"] = config_local_1.urls.BASE_URL + config_local_1.urls.MESSAGE_FILE_URL + file.filename;
        return this.response(file);
    }
    getFile(filename, res) {
        return res.sendFile(filename, { root: "uploads/client" });
    }
    remove(id) {
        return this.messageService.remove(+id);
    }
    async updateRoomsWithClientPhoto() {
        return await this.messageService.updateRoomsWithClientPhoto();
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findAll", null);
__decorate([
    common_1.Get("room/:room_id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("room_id")),
    __param(2, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findRoomMessages", null);
__decorate([
    common_1.Get("last/:room_id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("room_id")),
    __param(2, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findRoomLastMessages", null);
__decorate([
    common_1.Get("advisor"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findAdvisorMessages", null);
__decorate([
    common_1.Get("advisor_unread_messages"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "advisorUnreadMessages", null);
__decorate([
    common_1.Post("clear_room_messages/:room_id"),
    __param(0, common_1.Request()),
    __param(1, common_1.Param("room_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "clearRoomMessages", null);
__decorate([
    common_1.Post("clear_advisor_messages"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "clearAdvisorMessages", null);
__decorate([
    common_1.Post("clear_client_messages"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "clearClientMessages", null);
__decorate([
    common_1.Post("upload"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "uploadFile", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("file/:filename"),
    __param(0, common_1.Param("filename")),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "getFile", null);
__decorate([
    common_1.Delete(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "remove", null);
__decorate([
    common_1.Post("updateRoomsWithClientPhoto"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateRoomsWithClientPhoto", null);
MessageController = __decorate([
    common_1.Controller("message"),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        nexerone_service_1.NexeroneService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map