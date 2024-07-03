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
exports.Forwardings = void 0;
const typeorm_1 = require("typeorm");
let Forwardings = class Forwardings {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Forwardings.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Forwardings.prototype, "address", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Forwardings.prototype, "forwarding", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Forwardings.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Forwardings.prototype, "dest_domain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Forwardings.prototype, "is_maillist", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Forwardings.prototype, "is_list", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Forwardings.prototype, "is_forwarding", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Forwardings.prototype, "active", void 0);
Forwardings = __decorate([
    typeorm_1.Entity()
], Forwardings);
exports.Forwardings = Forwardings;
//# sourceMappingURL=forwardings.entity1.js.map