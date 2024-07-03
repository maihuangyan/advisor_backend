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
exports.ConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../guards/enum/role.enum");
const roles_decorator_1 = require("../guards/roles.decorator");
const base_controller_1 = require("../_base/base.controller");
const configuration_service_1 = require("./configuration.service");
const create_configuration_dto_1 = require("./dto/create-configuration.dto");
const update_configuration_dto_1 = require("./dto/update-configuration.dto");
let ConfigurationController = class ConfigurationController extends base_controller_1.BaseController {
    constructor(configurationService) {
        super();
        this.configurationService = configurationService;
    }
    create(createConfigurationDto) {
        return this.configurationService.create(createConfigurationDto);
    }
    async findAll(req) {
        return this.response(await this.configurationService.getConfigurations(req.user));
    }
    setDefaultValues() {
        this.configurationService.setDefaultValues();
        return this.response("success");
    }
    setDefaultFees(req, data) {
        if (req.user.role == "admin") {
            this.configurationService.setDefaultFees(data);
            return this.response("success");
        }
    }
    async updateEmailFooter(req, data) {
        if (req.user.role == "admin") {
            this.configurationService.updateEmailFooter(data.advisor_id, data.email_footer);
            return this.response("success");
        }
    }
    async emailFooter(req) {
        return await this.configurationService.getEmailFooter(req.user.id);
    }
    findOne(id) {
        return this.configurationService.findOne(+id);
    }
    update(dto) {
        return this.configurationService.update(dto);
    }
    remove(id) {
        return this.configurationService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_configuration_dto_1.CreateConfigurationDto]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "findAll", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Get("set_default_values"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "setDefaultValues", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Post("set_default_fees"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "setDefaultFees", null);
__decorate([
    common_1.Post("update_email_footer"),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "updateEmailFooter", null);
__decorate([
    common_1.Get("email_footer"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "emailFooter", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "findOne", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Patch(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_configuration_dto_1.UpdateConfigurationDto]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "update", null);
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Admin),
    common_1.Delete(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationController.prototype, "remove", null);
ConfigurationController = __decorate([
    common_1.Controller("configuration"),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);
exports.ConfigurationController = ConfigurationController;
//# sourceMappingURL=configuration.controller.js.map