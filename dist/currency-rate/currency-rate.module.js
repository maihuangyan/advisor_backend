"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRateModule = void 0;
const common_1 = require("@nestjs/common");
const currency_rate_service_1 = require("./currency-rate.service");
const currency_rate_controller_1 = require("./currency-rate.controller");
const typeorm_1 = require("@nestjs/typeorm");
const nexerone_module_1 = require("../nexerone/nexerone.module");
const currency_rate_entity_1 = require("./entities/currency-rate.entity");
let CurrencyRateModule = class CurrencyRateModule {
};
CurrencyRateModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([currency_rate_entity_1.CurrencyRate]), nexerone_module_1.NexeroneModule],
        controllers: [currency_rate_controller_1.CurrencyRateController],
        providers: [currency_rate_service_1.CurrencyRateService],
        exports: [currency_rate_service_1.CurrencyRateService],
    })
], CurrencyRateModule);
exports.CurrencyRateModule = CurrencyRateModule;
//# sourceMappingURL=currency-rate.module.js.map