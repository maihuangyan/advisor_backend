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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const create_configuration_dto_1 = require("./dto/create-configuration.dto");
const configuration_entity_1 = require("./entities/configuration.entity");
const role_enum_1 = require("../guards/enum/role.enum");
let ConfigurationService = class ConfigurationService extends base_service_1.BaseService {
    constructor(mRepository) {
        super();
        this.mRepository = mRepository;
    }
    setDefaultValues() {
        let dto = new create_configuration_dto_1.CreateConfigurationDto("fee_sales_gold_coins", "280");
        this.update(dto);
        dto = new create_configuration_dto_1.CreateConfigurationDto("fee_sales_gold_bars", "25");
        this.update(dto);
        dto = new create_configuration_dto_1.CreateConfigurationDto("fee_year_gold_store_manage", "20");
        this.update(dto);
        dto = new create_configuration_dto_1.CreateConfigurationDto("fee_sales_silver_coins", "2800");
        this.update(dto);
        dto = new create_configuration_dto_1.CreateConfigurationDto("fee_sales_silver_bars", "300");
        this.update(dto);
        dto = new create_configuration_dto_1.CreateConfigurationDto("fee_year_silver_store_manage", "40");
        this.update(dto);
    }
    setDefaultFees(fees) {
        const feesList = Object.keys(fees).map((key) => new create_configuration_dto_1.CreateConfigurationDto(key, fees[key]));
        for (const fee of feesList) {
            this.update(fee);
        }
    }
    async getEmailFooter(advisor_id) {
        const conf = await this.mRepository.findOne({ key: "email_footer_" + advisor_id });
        if (conf) {
            return conf.value;
        }
        else {
            return '';
        }
    }
    updateEmailFooter(advisor_id, content) {
        return this.update(new create_configuration_dto_1.CreateConfigurationDto("email_footer_" + advisor_id, content));
    }
    async create(dto) {
        const configuration = new configuration_entity_1.Configuration(dto);
        return await this.mRepository.save(configuration);
    }
    async getConfigurations(user) {
        const confList = await this.mRepository.find();
        const result = {};
        for (const conf of confList) {
            if (conf.key.includes('email_footer')) {
                if (user.role == role_enum_1.Role.Admin) {
                    result[conf.key] = conf.value;
                }
                else {
                    if (conf.key == 'email_footer_' + user.id) {
                        result['email_footer'] = conf.value;
                    }
                }
            }
            else {
                result[conf.key] = conf.value;
            }
        }
        return result;
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async update(dto) {
        const configuration = await this.mRepository.findOne({ key: dto.key });
        if (configuration) {
            configuration.update(dto);
            return await this.mRepository.save(configuration);
        }
        else {
            return await this.create(new create_configuration_dto_1.CreateConfigurationDto(dto.key, dto.value));
        }
    }
    remove(id) {
        return `This action removes a #${id} configuration`;
    }
};
ConfigurationService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(configuration_entity_1.Configuration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfigurationService);
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configuration.service.js.map