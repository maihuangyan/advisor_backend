"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const client_controller_1 = require("./client.controller");
const typeorm_1 = require("@nestjs/typeorm");
const client_entity_1 = require("./entities/client.entity");
const nexerone_module_1 = require("../nexerone/nexerone.module");
const balance_module_1 = require("../balance/balance.module");
const currency_rate_module_1 = require("../currency-rate/currency-rate.module");
const configuration_module_1 = require("../configuration/configuration.module");
const user_module_1 = require("../user/user.module");
let ClientModule = class ClientModule {
};
ClientModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([client_entity_1.Client]),
            nexerone_module_1.NexeroneModule,
            balance_module_1.BalanceModule,
            currency_rate_module_1.CurrencyRateModule,
            configuration_module_1.ConfigurationModule,
            common_1.forwardRef(() => user_module_1.UserModule)
        ],
        controllers: [client_controller_1.ClientController],
        providers: [client_service_1.ClientService],
        exports: [client_service_1.ClientService],
    })
], ClientModule);
exports.ClientModule = ClientModule;
//# sourceMappingURL=client.module.js.map