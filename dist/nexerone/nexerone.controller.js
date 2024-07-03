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
exports.NexeroneController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
const base_controller_1 = require("../_base/base.controller");
const nexerone_service_1 = require("./nexerone.service");
let NexeroneController = class NexeroneController extends base_controller_1.BaseController {
    constructor(nexeroneService) {
        super();
        this.nexeroneService = nexeroneService;
    }
    async verify(params) {
        return this.response(await this.nexeroneService.verifyToken(params.token));
    }
    async nexerone_token() {
        return this.response(await this.nexeroneService.getNexoroneToken());
    }
    async test(req) {
        return this.response(await this.nexeroneService.sendPushNotification("yangyang88511@gmail.com", "Test", "Advisor sent you a new message"));
    }
};
__decorate([
    roles_decorator_1.Public(),
    common_1.Post("verify"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NexeroneController.prototype, "verify", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Developer),
    common_1.Get("token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NexeroneController.prototype, "nexerone_token", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("test"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NexeroneController.prototype, "test", null);
NexeroneController = __decorate([
    common_1.Controller("nexerone"),
    __metadata("design:paramtypes", [nexerone_service_1.NexeroneService])
], NexeroneController);
exports.NexeroneController = NexeroneController;
//# sourceMappingURL=nexerone.controller.js.map