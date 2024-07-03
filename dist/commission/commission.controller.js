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
exports.CommissionController = void 0;
const common_1 = require("@nestjs/common");
const commission_service_1 = require("./commission.service");
const roles_decorator_1 = require("../guards/roles.decorator");
const role_enum_1 = require("../guards/enum/role.enum");
const base_controller_1 = require("../_base/base.controller");
let CommissionController = class CommissionController extends base_controller_1.BaseController {
    constructor(commissionService) {
        super();
        this.commissionService = commissionService;
    }
    async advisorCommissions(req, query) {
        const advisor_id = req.user.id;
        const advisor_email = req.user.email;
        const result = this.response(await this.commissionService.advisor_overview(advisor_id, advisor_email, query.offset, query.limit));
        return result;
    }
    findOne(id) {
        return this.commissionService.findOne(+id);
    }
};
__decorate([
    roles_decorator_1.Roles(role_enum_1.Role.Advisor),
    common_1.Get("advisor_commissions"),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "advisorCommissions", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommissionController.prototype, "findOne", null);
CommissionController = __decorate([
    common_1.Controller('commission'),
    __metadata("design:paramtypes", [commission_service_1.CommissionService])
], CommissionController);
exports.CommissionController = CommissionController;
//# sourceMappingURL=commission.controller.js.map