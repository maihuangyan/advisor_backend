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
exports.Client = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const create_client_dto_1 = require("../dto/create-client.dto");
const id_type_enum_1 = require("./enum/id_type.enum");
let Client = class Client {
    constructor(dto) {
        if (!dto)
            return;
        this.username = dto.username;
        this.customer_id = dto.customer_id;
        this.email = dto.email;
        this.phone = dto.phone;
        this.first_name = dto.first_name;
        this.last_name = dto.last_name;
        this.photo = dto.photo;
        this.brief = dto.brief;
        this.status = dto.status;
        this.registered_at = dto.registered_at;
        this.title = dto.title;
        this.dob = dto.dob;
        this.identification_type = dto.identification_type;
        this.id_number = dto.id_number;
        this.country = dto.country;
        this.citizenship = dto.citizenship;
        this.pa_address1 = dto.pa_address1;
        this.pa_address2 = dto.pa_address2;
        this.pa_city = dto.pa_city;
        this.pa_state = dto.pa_state;
        this.pa_zip = dto.pa_zip;
        this.pa_country = dto.pa_country;
        this.ma_address1 = dto.ma_address1;
        this.ma_address2 = dto.ma_address2;
        this.ma_city = dto.ma_city;
        this.ma_state = dto.ma_state;
        this.ma_zip = dto.ma_zip;
        this.ma_country = dto.ma_country;
        this.fee_bps_gold = dto.fee_bps_gold;
        this.fee_bps_silver = dto.fee_bps_silver;
        this.fee_bps_gold_bar = dto.fee_bps_gold_bar;
        this.fee_ag_bps_storage = dto.fee_ag_bps_storage;
        this.fee_au_bps_storage = dto.fee_au_bps_storage;
        this.fee_bps_silver_bar = dto.fee_bps_silver_bar;
        this.bank_system = dto.bank_system;
        this.bank_token = dto.bank_token;
        this.bank_other = dto.bank_other;
        this.kyc_net_worth = dto.kyc_net_worth;
        this.kyc_source_funds = dto.kyc_source_funds;
        this.kyc_profession = dto.kyc_profession;
        this.kyc_video_link = dto.kyc_video_link;
        this.kyc_income = dto.kyc_income;
        this.kyc_other = dto.kyc_other;
        this.crm_client_id = dto.crm_client_id;
        this.crm_company_id = dto.crm_company_id;
        this.crm_username = dto.crm_username;
        this.crm_user_id = dto.crm_user_id;
        this.crm_user_token = dto.crm_user_token;
        this.crm_email = dto.crm_email;
    }
    getFullName() {
        if (this.first_name && this.last_name) {
            return this.first_name + " " + this.last_name;
        }
        if (this.first_name) {
            return this.first_name;
        }
        if (this.last_name) {
            return this.last_name;
        }
        return this.email;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Client.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Client.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "first_name", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "photo", void 0);
__decorate([
    typeorm_1.Column({ type: "text", default: "" }),
    __metadata("design:type", String)
], Client.prototype, "brief", void 0);
__decorate([
    typeorm_1.Column({ default: "", length: 10 }),
    __metadata("design:type", String)
], Client.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ default: "", length: 10 }),
    __metadata("design:type", String)
], Client.prototype, "dob", void 0);
__decorate([
    typeorm_1.Column({ default: id_type_enum_1.IdentificationType.Passport }),
    __metadata("design:type", String)
], Client.prototype, "identification_type", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "id_number", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "country", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "citizenship", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_address1", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_address2", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_city", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_state", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_zip", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "pa_country", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_address1", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_address2", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_city", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_state", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_zip", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Client.prototype, "ma_country", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_bps_gold_bar", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_bps_silver_bar", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_bps_gold", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_bps_silver", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_au_bps_storage", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 7, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "fee_ag_bps_storage", void 0);
__decorate([
    typeorm_1.Column({ default: "active" }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "bank_system", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "bank_token", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "bank_other", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Client.prototype, "registered_at", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_net_worth", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_source_funds", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_income", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_profession", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_video_link", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "kyc_other", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_client_id", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_company_id", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_username", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_user_id", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_user_token", void 0);
__decorate([
    typeorm_1.Column({ default: "", nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "crm_email", void 0);
__decorate([
    typeorm_1.Column({ default: "EUR", length: 10 }),
    __metadata("design:type", String)
], Client.prototype, "currency", void 0);
Client = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto])
], Client);
exports.Client = Client;
//# sourceMappingURL=client.entity.js.map