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
exports.BalanceController = void 0;
const common_1 = require("@nestjs/common");
const base_controller_1 = require("../_base/base.controller");
const balance_service_1 = require("./balance.service");
const roles_decorator_1 = require("../guards/roles.decorator");
let BalanceController = class BalanceController extends base_controller_1.BaseController {
    constructor(balanceService) {
        super();
        this.balanceService = balanceService;
    }
    async cardCurrency(req) {
        const result = await this.balanceService.findClientCardBalance(req.user.email);
        return this.response(result);
    }
};
__decorate([
    common_1.Get("card_currency"),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "cardCurrency", null);
BalanceController = __decorate([
    common_1.Controller("balance"),
    __metadata("design:paramtypes", [balance_service_1.BalanceService])
], BalanceController);
exports.BalanceController = BalanceController;
//# sourceMappingURL=balance.controller.js.map