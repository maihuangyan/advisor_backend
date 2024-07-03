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
exports.BalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const client_entity_1 = require("../client/entities/client.entity");
const currency_rate_service_1 = require("../currency-rate/currency-rate.service");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const create_balance_dto_1 = require("./dto/create-balance.dto");
const balance_entity_1 = require("./entities/balance.entity");
const balance_type_enum_1 = require("./entities/enum/balance_type.enum");
const utils_1 = require("../utils/utils");
const metal_currency_enum_1 = require("../currency-rate/entities/enum/metal_currency.enum");
let BalanceService = class BalanceService extends base_service_1.BaseService {
    constructor(mRepository, nexeroneService, currencyRateService) {
        super();
        this.mRepository = mRepository;
        this.nexeroneService = nexeroneService;
        this.currencyRateService = currencyRateService;
    }
    async create(dto) {
        const balance = new balance_entity_1.Balance(dto);
        const errors = await class_validator_1.validate(balance);
        this.consoleLog(errors);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        else {
            const newEntity = await this.mRepository.save(balance);
            this.consoleLog(newEntity);
            return newEntity;
        }
    }
    async findBalancesByClientIds(client_ids) {
        return await this.mRepository
            .createQueryBuilder()
            .where("client_id in (:...client_ids)", { client_ids })
            .getMany();
    }
    async findClientsBalances(client_emails) {
        return await this.mRepository
            .createQueryBuilder()
            .where("client_email in (:...client_emails)", { client_emails })
            .getMany();
    }
    async findClientBalances(client_id) {
        return await this.mRepository.find({ client_id });
    }
    async createOrUpdate(client, data, type) {
        if (!data || !data.Currency || !data.AccountNumber)
            return;
        let currentBalance = 0;
        if (data.CurrentBalance && typeof data.CurrentBalance === 'string' || data.CurrentBalance instanceof String) {
            const updated = data.CurrentBalance.replace(",", "").replace(" ", "");
            if (updated && !isNaN(parseFloat(updated))) {
                currentBalance = parseFloat(updated);
            }
        }
        let availableBalance = 0;
        if (data.AvailableBalance && typeof data.AvailableBalance === 'string' || data.AvailableBalance instanceof String) {
            const updated = data.AvailableBalance.replace(",", "").replace(" ", "");
            if (updated && !isNaN(parseFloat(updated))) {
                availableBalance = parseFloat(updated);
            }
        }
        const entity = await this.findByClientEmailAndAccountNumber(client.email, data.AccountNumber);
        if (entity) {
            if (client.id) {
                entity.client_id = client.id;
            }
            entity.available_balance = availableBalance;
            entity.currency = data.Currency;
            entity.current_balance = currentBalance;
            entity.type = type;
            return await this.mRepository.save(entity);
        }
        else {
            const dto = new create_balance_dto_1.CreateBalanceDto(client.id, client.email, type, data.AccountNumber, data.Currency, currentBalance, availableBalance);
            const newEntity = new balance_entity_1.Balance(dto);
            return await this.mRepository.save(newEntity);
        }
    }
    getCurrencyDefaultType(type) {
        switch (type) {
            case balance_type_enum_1.BalanceType.Gold:
                return "GEA";
            case balance_type_enum_1.BalanceType.Silver:
                return "SEA";
            case balance_type_enum_1.BalanceType.Goldbar:
                return "XAU";
            case balance_type_enum_1.BalanceType.Silverbar:
                return "XAG";
            case balance_type_enum_1.BalanceType.Card:
                return "EUR";
        }
    }
    async loadAndSaveClientBalances(client) {
        const clientBalances = await this.nexeroneService.loadClientBalances(client.email.toLowerCase());
        if (clientBalances.error) {
            return clientBalances;
        }
        return await this.saveClientBalances(client, clientBalances);
    }
    async convertClientBalancesWithCardCurrency(displayCurrency, balances) {
        const uBalances = [];
        for (const balance of balances) {
            const cBalance = await this.currencyRateService.convertCurrency(balance, displayCurrency);
            if (cBalance)
                uBalances.push(cBalance);
        }
        return uBalances;
    }
    async saveClientBalances(client, clientBalances) {
        const result = [];
        const existClientBalances = await this.findClientBalances(client.id);
        for (const balance of existClientBalances) {
            if (balance.type == balance_type_enum_1.BalanceType.Card) {
                if (!clientBalances.Card || balance.currency != clientBalances.Card.Currency) {
                    await this.remove(balance.id);
                }
            }
            else {
                const nBalance = clientBalances[balance.currency];
                if (!nBalance) {
                    await this.remove(balance.id);
                }
            }
        }
        for (const [key, balance] of Object.entries(clientBalances)) {
            if (key == "Card") {
                this.consoleLog('card');
                this.consoleLog(balance);
                if (Array.isArray(balance)) {
                    this.consoleLog('card1');
                    for (const item of balance) {
                        this.consoleLog('card2');
                        result.push(await this.createOrUpdate(client, item, balance_type_enum_1.BalanceType.Card));
                    }
                }
            }
            else if (Object.keys(metal_currency_enum_1.MetalCurrency).includes(key)) {
                result.push(await this.createOrUpdate(client, balance, utils_1.getCoinType(key)));
            }
        }
        return result;
    }
    async findByClientEmailAndCurrency(client_email, currency) {
        return this.mRepository.findOne({
            where: {
                client_email: client_email.toLowerCase(),
                currency,
            },
        });
    }
    async findByClientEmailAndAccountNumber(client_email, account_number) {
        return this.mRepository.findOne({
            where: {
                client_email: client_email.toLowerCase(),
                account_number,
            },
        });
    }
    async findClientCardBalance(client_email) {
        const qb = this.mRepository.createQueryBuilder()
            .where("currency IN (:...currencies)", { currencies: ['EUR', 'USD'] })
            .andWhere("client_email = :client_email", { client_email });
        return await qb.getOne();
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async update(id, dto) {
        const balance = await this.findOne(id);
        balance.account_number = dto.account_number;
        balance.client_id = dto.client_id;
        balance.client_email = dto.client_email.toLowerCase();
        balance.available_balance = dto.available_balance;
        balance.current_balance = dto.current_balance;
        balance.currency = dto.currency;
        return await this.mRepository.save(balance);
    }
    async remove(id) {
        return await this.mRepository.delete(id);
    }
    async removeByEmail(email) {
        return await this.mRepository.delete({ client_email: email.toLowerCase() });
    }
};
BalanceService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(balance_entity_1.Balance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nexerone_service_1.NexeroneService,
        currency_rate_service_1.CurrencyRateService])
], BalanceService);
exports.BalanceService = BalanceService;
//# sourceMappingURL=balance.service.js.map