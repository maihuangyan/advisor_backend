"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionModule = void 0;
const common_1 = require("@nestjs/common");
const commission_service_1 = require("./commission.service");
const commission_controller_1 = require("./commission.controller");
const balance_module_1 = require("../balance/balance.module");
const typeorm_1 = require("@nestjs/typeorm");
const commission_entity_1 = require("./entities/commission.entity");
const currency_rate_module_1 = require("../currency-rate/currency-rate.module");
const user_module_1 = require("../user/user.module");
let CommissionModule = class CommissionModule {
};
CommissionModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([commission_entity_1.Commission]),
            currency_rate_module_1.CurrencyRateModule,
            balance_module_1.BalanceModule,
            user_module_1.UserModule,
        ],
        controllers: [commission_controller_1.CommissionController],
        providers: [commission_service_1.CommissionService],
        exports: [commission_service_1.CommissionService]
    })
], CommissionModule);
exports.CommissionModule = CommissionModule;
//# sourceMappingURL=commission.module.js.map