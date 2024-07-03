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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCurrencyRateDto = void 0;
const class_validator_1 = require("class-validator");
const metal_currency_enum_1 = require("../entities/enum/metal_currency.enum");
class CreateCurrencyRateDto {
    constructor(metal, usd_buy, usd_sell, eur_buy, eur_sell, chf_buy, chf_sell, gbp_buy, gbp_sell) {
        this.metal = metal;
        this.usd_buy = usd_buy;
        this.usd_sell = usd_sell;
        this.eur_buy = eur_buy;
        this.eur_sell = eur_sell;
        this.chf_buy = chf_buy;
        this.chf_sell = chf_sell;
        this.gbp_buy = gbp_buy;
        this.gbp_sell = gbp_sell;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateCurrencyRateDto.prototype, "metal", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "usd_buy", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "usd_sell", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "eur_buy", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "eur_sell", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "chf_buy", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "chf_sell", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "gbp_buy", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateCurrencyRateDto.prototype, "gbp_sell", void 0);
exports.CreateCurrencyRateDto = CreateCurrencyRateDto;
//# sourceMappingURL=create-currency-rate.dto.js.map