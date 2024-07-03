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
exports.CurrencyRateService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const balance_type_enum_1 = require("../balance/entities/enum/balance_type.enum");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const create_currency_rate_dto_1 = require("./dto/create-currency-rate.dto");
const currency_rate_entity_1 = require("./entities/currency-rate.entity");
const metal_currency_enum_1 = require("./entities/enum/metal_currency.enum");
const balance_entity_1 = require("../balance/entities/balance.entity");
let CurrencyRateService = class CurrencyRateService extends base_service_1.BaseService {
    constructor(mRepository, nexeroneService) {
        super();
        this.mRepository = mRepository;
        this.nexeroneService = nexeroneService;
    }
    async createOrUpdate(dto) {
        const entity = await this.findOne(dto.metal);
        if (entity) {
            this.update(entity.id, dto);
        }
        else {
            this.create(dto);
        }
    }
    async create(dto) {
        const entity = new currency_rate_entity_1.CurrencyRate(dto);
        return await this.mRepository.save(entity);
    }
    async findAll() {
        return await this.mRepository.find();
    }
    async findOne(metal) {
        return await this.mRepository.findOne({ metal });
    }
    async update(id, dto) {
        const entity = new currency_rate_entity_1.CurrencyRate(dto);
        entity.id = id;
        return await this.mRepository.save(entity);
    }
    remove(id) {
        return `This action removes a #${id} currencyRate`;
    }
    async handleInterval() {
        const response = await this.nexeroneService.loadCurrencyRates();
        if (!response.error) {
            for (const key of Object.keys(response)) {
                const dto = new create_currency_rate_dto_1.CreateCurrencyRateDto(metal_currency_enum_1.MetalCurrency[key], +response[key].USD.buy_price, +response[key].USD.sell_price, +response[key].EUR.buy_price, +response[key].EUR.sell_price, +response[key].CHF.buy_price, +response[key].CHF.sell_price, +response[key].GBP.buy_price, +response[key].GBP.sell_price);
                this.createOrUpdate(dto);
            }
        }
    }
    async convertCurrency(balance, currency, is_buy = true, commission = 0.0) {
        balance.current_balance_origin = balance.current_balance;
        balance.available_balance_origin = balance.available_balance;
        if (balance.currency == currency) {
            balance.currency_market = currency;
            return balance;
        }
        const rate = await this.findOne(balance.currency);
        if (!rate) {
            balance.current_balance = balance.current_balance * (await this.getRate(balance.currency, currency));
            balance.available_balance = balance.available_balance * (await this.getRate(balance.currency, currency));
            balance.currency_market = currency;
            return balance;
        }
        ;
        const serviceCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];
        if (serviceCurrencies.includes(currency)) {
            if (is_buy) {
                balance.current_balance = parseFloat('' + balance.current_balance) * rate[currency.toLowerCase() + '_buy'];
                balance.available_balance = parseFloat('' + balance.available_balance) * rate[currency.toLowerCase() + '_buy'];
            }
            else {
                balance.current_balance = parseFloat('' + balance.current_balance) * rate[currency.toLowerCase() + '_sell'];
                balance.available_balance = parseFloat('' + balance.available_balance) * rate[currency.toLowerCase() + '_sell'];
            }
        }
        else {
            if (is_buy) {
                balance.current_balance = parseFloat('' + balance.current_balance) * rate.eur_buy * (await this.getRate('EUR', currency));
                balance.available_balance = parseFloat('' + balance.available_balance) * rate.eur_buy * (await this.getRate('EUR', currency));
            }
            else {
                balance.current_balance = parseFloat('' + balance.current_balance) * rate.eur_sell * (await this.getRate('EUR', currency));
                balance.available_balance = parseFloat('' + balance.available_balance) * rate.eur_sell * (await this.getRate('EUR', currency));
            }
        }
        if (balance.type == balance_type_enum_1.BalanceType.Goldbar || balance.type == balance_type_enum_1.BalanceType.Silverbar) {
            balance.current_balance = balance.current_balance / 32.1507;
            balance.available_balance = balance.available_balance / 32.1507;
        }
        if (is_buy && commission > 0) {
            balance.current_balance = balance.current_balance * (100 + commission) / 100;
            balance.available_balance = balance.available_balance * (100 + commission) / 100;
        }
        balance.currency_market = currency;
        return balance;
    }
    async getPrice(coinCurrency, amount, currency, is_buy = true) {
        const rate = await this.findOne(coinCurrency);
        if (!rate)
            return 0;
        const serviceCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];
        if (serviceCurrencies.includes(currency)) {
            if (is_buy) {
                return parseFloat('' + amount) * rate[currency.toLowerCase() + '_buy'];
            }
            else {
                return parseFloat('' + amount) * rate[currency.toLowerCase() + '_sell'];
            }
        }
        else {
            if (is_buy) {
                return parseFloat('' + amount) * rate.eur_buy * (await this.getRate('EUR', currency));
            }
            else {
                return parseFloat('' + amount) * rate.eur_sell * (await this.getRate('EUR', currency));
            }
        }
    }
    async getRate(sourceCurrency, targetCurrency) {
        const rate = await this.findOne(metal_currency_enum_1.MetalCurrency.XAU);
        if (sourceCurrency == "USD") {
            if (targetCurrency == "EUR") {
                return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.usd_buy);
            }
            else if (targetCurrency == "GBP") {
                return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.usd_buy);
            }
            else if (targetCurrency == "CHF") {
                return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.usd_buy);
            }
        }
        else if (sourceCurrency == "EUR") {
            if (targetCurrency == "USD") {
                return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.eur_buy);
            }
            else if (targetCurrency == "GBP") {
                return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.eur_buy);
            }
            else if (targetCurrency == "CHF") {
                return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.eur_buy);
            }
        }
        else if (sourceCurrency == "GBP") {
            if (targetCurrency == "EUR") {
                return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.gbp_buy);
            }
            else if (targetCurrency == "USD") {
                return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.gbp_buy);
            }
            else if (targetCurrency == "CHF") {
                return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.gbp_buy);
            }
        }
        else if (sourceCurrency == "CHF") {
            if (targetCurrency == "EUR") {
                return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.chf_buy);
            }
            else if (targetCurrency == "GBP") {
                return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.chf_buy);
            }
            else if (targetCurrency == "USD") {
                return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.chf_buy);
            }
        }
        return 1;
    }
};
__decorate([
    schedule_1.Interval(300000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CurrencyRateService.prototype, "handleInterval", null);
CurrencyRateService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(currency_rate_entity_1.CurrencyRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nexerone_service_1.NexeroneService])
], CurrencyRateService);
exports.CurrencyRateService = CurrencyRateService;
//# sourceMappingURL=currency-rate.service.js.map