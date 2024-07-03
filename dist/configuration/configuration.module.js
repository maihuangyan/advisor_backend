"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationModule = void 0;
const common_1 = require("@nestjs/common");
const configuration_service_1 = require("./configuration.service");
const configuration_controller_1 = require("./configuration.controller");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_entity_1 = require("./entities/configuration.entity");
let ConfigurationModule = class ConfigurationModule {
};
ConfigurationModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([configuration_entity_1.Configuration])],
        controllers: [configuration_controller_1.ConfigurationController],
        providers: [configuration_service_1.ConfigurationService],
        exports: [configuration_service_1.ConfigurationService],
    })
], ConfigurationModule);
exports.ConfigurationModule = ConfigurationModule;
//# sourceMappingURL=configuration.module.js.map