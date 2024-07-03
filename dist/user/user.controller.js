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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
const const_1 = require("../utils/const");
const utils_1 = require("../utils/utils");
const base_controller_1 = require("../_base/base.controller");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async addAdvisor(data) {
        return this.response(await this.userService.add(data));
    }
    async findAll() {
        return this.response(await this.userService.findAll());
    }
    async find(query) {
        const page = query.page;
        if (!page) {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData,
            });
        }
        const limit = query.limit;
        const role = role_enum_1.Role.Advisor;
        const status = query.status;
        const search_key = query.q;
        return this.response(await this.userService.find(+page, +limit, role, status, search_key));
    }
    async updateProfile(req, udto) {
        if (!udto.user_id || udto.user_id == req.user.id) {
            const res = await this.userService.update(+req.user.id, udto);
            return this.response(res);
        }
        else {
            const user = await this.userService.findOne(+req.user.id);
            if (!user) {
                return this.response({
                    error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor,
                });
            }
            if (user.role == "admin") {
                const res = await this.userService.update(+udto.user_id, udto);
                return this.response(res);
            }
            else {
                return this.response({
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
                });
            }
        }
    }
    update(id, updateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }
    async remove(id) {
        return this.response(await this.userService.remove(+id));
    }
    getProfile(req) {
        return this.response(req.user);
    }
    async updatePhoto(req, file) {
        const updateDto = new update_user_dto_1.UpdateUserDto();
        this.consoleLog(file);
        updateDto.photo = file.filename;
        const user_id = req.body ? (req.body.user_id ? req.body.user_id : 0) : 0;
        if (user_id == 0) {
            const res = await this.userService.update(+req.user.id, updateDto);
            return this.response(res);
        }
        else {
            if (isNaN(user_id)) {
                return this.response({
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData,
                });
            }
            const user = await this.userService.findOne(+req.user.id);
            if (user.role == "admin") {
                const res = await this.userService.update(user_id, updateDto);
                this.consoleLog(res);
                return this.response(res);
            }
            if (user.id == user_id) {
                const res = await this.userService.update(user_id, updateDto);
                this.consoleLog(res);
                return this.response(res);
            }
            else {
                return this.response({
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
                });
            }
        }
    }
    getProfilePhoto(file, res) {
        return res.sendFile(file, { root: "uploads/profile" });
    }
    uploadFile(file) {
        return this.response(file);
    }
    uploadFiles(files) {
        this.consoleLog(files);
        return this.response(files);
    }
    timezoneList() {
        return this.response(utils_1.getTimezoneList());
    }
    test(req) {
        const localDate = new Date();
        this.consoleLog("test:", localDate);
        this.consoleLog(localDate.toISOString());
        return this.response(req.user);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    common_1.Post("add_advisor"),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAdvisor", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    common_1.Get("search"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "find", null);
__decorate([
    common_1.Post("update_profile"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    common_1.Patch(":id"),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get("profile"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfile", null);
__decorate([
    common_1.Post("update_photo"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("image")),
    __param(0, common_1.Request()),
    __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePhoto", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("profile_photo/:file"),
    __param(0, common_1.Param("file")),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfilePhoto", null);
__decorate([
    common_1.Post("upload"),
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file")),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadFile", null);
__decorate([
    common_1.Post("uploads"),
    common_1.UseInterceptors(platform_express_1.FilesInterceptor("files")),
    __param(0, common_1.UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadFiles", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("timezone_list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "timezoneList", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("test"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "test", null);
UserController = __decorate([
    common_1.Controller("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map