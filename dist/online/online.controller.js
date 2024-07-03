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
exports.OnlineController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
const base_controller_1 = require("../_base/base.controller");
const online_service_1 = require("./online.service");
let OnlineController = class OnlineController extends base_controller_1.BaseController {
    constructor(onlineService) {
        super();
        this.onlineService = onlineService;
    }
    all() {
        return this.response(this.onlineService.getRooms());
    }
    list(req) {
        const advisor_id = req.user.id;
        return this.response(this.onlineService.getAdvisorRoomsOnlineStatus(advisor_id));
    }
    check(headers) {
        const token = headers.authorization.replace('Bearer ', '');
        return this.response(this.onlineService.getUserByToken(token));
    }
};
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Get('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OnlineController.prototype, "all", null);
__decorate([
    common_1.Get('list'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OnlineController.prototype, "list", null);
__decorate([
    common_1.Get('check'),
    __param(0, common_1.Headers()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OnlineController.prototype, "check", null);
OnlineController = __decorate([
    common_1.Controller('online'),
    __metadata("design:paramtypes", [online_service_1.OnlineService])
], OnlineController);
exports.OnlineController = OnlineController;
//# sourceMappingURL=online.controller.js.map