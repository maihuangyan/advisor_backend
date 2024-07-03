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
exports.Commission = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let Commission = class Commission {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Commission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Commission.prototype, "advisor_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "advisor_email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], Commission.prototype, "client_email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "client_customer_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "client_first_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "client_last_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "debit_account_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "debit_coin_currency", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "credit_account_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "credit_coin_currency", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 5, default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "coin_amount", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Commission.prototype, "buy_description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Commission.prototype, "transaction_id", void 0);
__decorate([
    typeorm_1.Column({ default: "pending" }),
    __metadata("design:type", String)
], Commission.prototype, "transaction_status", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 5, default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "fee_amount", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "fee_percent", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Commission.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Commission.prototype, "error", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Commission.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column({ default: true, nullable: true }),
    __metadata("design:type", Boolean)
], Commission.prototype, "status", void 0);
Commission = __decorate([
    typeorm_1.Entity()
], Commission);
exports.Commission = Commission;
//# sourceMappingURL=commission.entity.js.map