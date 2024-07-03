"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceModule = void 0;
const common_1 = require("@nestjs/common");
const balance_service_1 = require("./balance.service");
const balance_controller_1 = require("./balance.controller");
const typeorm_1 = require("@nestjs/typeorm");
const nexerone_module_1 = require("../nexerone/nexerone.module");
const balance_entity_1 = require("./entities/balance.entity");
const currency_rate_module_1 = require("../currency-rate/currency-rate.module");
let BalanceModule = class BalanceModule {
};
BalanceModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([balance_entity_1.Balance]),
            nexerone_module_1.NexeroneModule,
            currency_rate_module_1.CurrencyRateModule,
        ],
        controllers: [balance_controller_1.BalanceController],
        providers: [balance_service_1.BalanceService],
        exports: [balance_service_1.BalanceService],
    })
], BalanceModule);
exports.BalanceModule = BalanceModule;
//# sourceMappingURL=balance.module.js.map