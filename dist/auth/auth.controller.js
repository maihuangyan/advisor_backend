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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../guards/roles.decorator");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const create_user_dto_1 = require("../user/dto/create-user.dto");
const base_controller_1 = require("../_base/base.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const local_auth_guard_1 = require("./guards/local-auth.guard");
let AuthController = class AuthController extends base_controller_1.BaseController {
    constructor(authService, nexeroneService) {
        super();
        this.authService = authService;
        this.nexeroneService = nexeroneService;
    }
    login(req) {
        const result = this.authService.login(req.user);
        return this.response(result);
    }
    async register(userData) {
        if (!userData.username) {
            userData.username = userData.email;
        }
        const result = await this.authService.register(userData);
        this.consoleLog(result);
        return this.response(result);
    }
    async forgotPassword(params) {
        const result = await this.authService.forgotPassword(params.email);
        return this.response(result);
    }
    async resetForgotPassword(params) {
        const result = await this.authService.resetForgotPassword(params);
        return this.response(result);
    }
    async resetPassword(req, passwords) {
        const userID = req.user.id;
        const result = await this.authService.resetPassword(+userID, passwords);
        return this.response(result);
    }
    async verify(token) {
        return this.response(await this.authService.verifyToken(token.token));
    }
};
__decorate([
    roles_decorator_1.Public(),
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post("login"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Post("register"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Post("forgot_password"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Post("reset_forgot_password"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetForgotPassword", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post("reset_password"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Post("verify"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
AuthController = __decorate([
    common_1.Controller("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        nexerone_service_1.NexeroneService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map