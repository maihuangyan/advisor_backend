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
exports.ConnectionController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
const const_1 = require("../utils/const");
const base_controller_1 = require("../_base/base.controller");
const connection_service_1 = require("./connection.service");
const create_connection_dto_1 = require("./dto/create-connection.dto");
const update_connection_dto_1 = require("./dto/update-connection.dto");
const user_service_1 = require("../user/user.service");
let ConnectionController = class ConnectionController extends base_controller_1.BaseController {
    constructor(connectionService, userService) {
        super();
        this.connectionService = connectionService;
        this.userService = userService;
    }
    async create(dto) {
        return this.response(await this.connectionService.create(dto));
    }
    async clients(req) {
        const advisor_id = req.user.id;
        const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
        return this.response(await this.connectionService.advisor_clients(displayCurrency, advisor_id));
    }
    async advisorOverview(req, query) {
        const advisor_id = req.user.id;
        const advisor_email = req.user.email;
        const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
        const result = this.response(await this.connectionService.advisor_overview(displayCurrency, advisor_id, advisor_email, +query.refresh));
        result['refresh'] = query.refresh;
        return result;
    }
    async deleteAdvisor(advisor_id) {
        return this.response(this.connectionService.deleteAdvisor(advisor_id));
    }
    async search_clients(req, query) {
        const advisor_id = query.advisor_id;
        const page = query.page;
        const limit = query.limit;
        const status = query.status;
        const search_key = query.q;
        const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
        return this.response(await this.connectionService.find(advisor_id, +page, +limit, status, search_key, displayCurrency));
    }
    async findAdvisorByClientEmail(req) {
        if (!req.headers.authorization) {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeNoToken,
            });
        }
        if (!req.headers.authorization.includes("Bearer ")) {
            return this.response({
                error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken,
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        return this.response(await this.connectionService.findByClient(token));
    }
    async updateFees(req, data) {
        if (req.user.role == "admin") {
            return this.response(await this.connectionService.updateClientFees(data));
        }
        else {
            const connection = await this.connectionService.findConnection(req.user.id, data.client_id);
            if (connection) {
                return this.response(await this.connectionService.updateClientFees(data));
            }
            else {
                return this.response({
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
                });
            }
        }
    }
    async findOne(id) {
        return await this.connectionService.findOne(+id);
    }
    update(id, dto) {
        return this.connectionService.update(+id, dto);
    }
    remove(id) {
        return this.response(this.connectionService.remove(+id));
    }
    async removeConnection(params) {
        return this.response(await this.connectionService.removeConnection(+params.advisor_id, +params.client_id));
    }
};
__decorate([
    common_1.Post(),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_connection_dto_1.CreateConnectionDto]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "create", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Advisor),
    common_1.Get("advisor_clients"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "clients", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Advisor),
    common_1.Get("advisor_overview"),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "advisorOverview", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Delete("delete_advisor/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "deleteAdvisor", null);
__decorate([
    common_1.Get("search_clients"),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "search_clients", null);
__decorate([
    roles_decorator_1.Public(),
    common_1.Get("advisor_of_client"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "findAdvisorByClientEmail", null);
__decorate([
    common_1.Post("update_fees"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "updateFees", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "findOne", null);
__decorate([
    common_1.Patch(":id"),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Param("id")),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_connection_dto_1.UpdateConnectionDto]),
    __metadata("design:returntype", void 0)
], ConnectionController.prototype, "update", null);
__decorate([
    common_1.Delete(":id"),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConnectionController.prototype, "remove", null);
__decorate([
    common_1.Post("remove"),
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "removeConnection", null);
ConnectionController = __decorate([
    common_1.Controller("connection"),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService,
        user_service_1.UserService])
], ConnectionController);
exports.ConnectionController = ConnectionController;
//# sourceMappingURL=connection.controller.js.map