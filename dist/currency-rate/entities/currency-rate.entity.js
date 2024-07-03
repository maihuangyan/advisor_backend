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
exports.CurrencyRate = void 0;
const typeorm_1 = require("typeorm");
const create_currency_rate_dto_1 = require("../dto/create-currency-rate.dto");
const metal_currency_enum_1 = require("./enum/metal_currency.enum");
let CurrencyRate = class CurrencyRate {
    constructor(dto) {
        if (!dto)
            return;
        this.metal = dto.metal;
        this.usd_buy = dto.usd_buy;
        this.usd_sell = dto.usd_sell;
        this.eur_buy = dto.eur_buy;
        this.eur_sell = dto.eur_sell;
        this.chf_buy = dto.chf_buy;
        this.chf_sell = dto.chf_sell;
        this.gbp_buy = dto.gbp_buy;
        this.gbp_sell = dto.gbp_sell;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CurrencyRate.prototype, "metal", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "usd_buy", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "usd_sell", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "eur_buy", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "eur_sell", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "chf_buy", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "chf_sell", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "gbp_buy", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CurrencyRate.prototype, "gbp_sell", void 0);
CurrencyRate = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_currency_rate_dto_1.CreateCurrencyRateDto])
], CurrencyRate);
exports.CurrencyRate = CurrencyRate;
//# sourceMappingURL=currency-rate.entity.js.map