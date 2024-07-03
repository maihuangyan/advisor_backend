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
exports.Balance = void 0;
const typeorm_1 = require("typeorm");
const create_balance_dto_1 = require("../dto/create-balance.dto");
const balance_type_enum_1 = require("./enum/balance_type.enum");
let Balance = class Balance {
    constructor(dto) {
        if (!dto)
            return;
        this.client_id = dto.client_id;
        this.client_email = dto.client_email.toLowerCase();
        this.type = dto.type;
        this.account_number = dto.account_number ? dto.account_number : 0;
        this.currency = dto.currency ? dto.currency : '';
        this.current_balance = dto.current_balance;
        this.available_balance = dto.available_balance;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Balance.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Balance.prototype, "client_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Balance.prototype, "client_email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Balance.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "account_number", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Balance.prototype, "currency", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 15, scale: 5, default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "current_balance", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 15, scale: 5, default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "available_balance", void 0);
Balance = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_balance_dto_1.CreateBalanceDto])
], Balance);
exports.Balance = Balance;
//# sourceMappingURL=balance.entity.js.map