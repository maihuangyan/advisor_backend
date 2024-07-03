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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const balance_service_1 = require("../balance/balance.service");
const balance_type_enum_1 = require("../balance/entities/enum/balance_type.enum");
const configuration_service_1 = require("../configuration/configuration.service");
const currency_rate_service_1 = require("../currency-rate/currency-rate.service");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const config_local_1 = require("../utils/config_local");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const create_client_dto_1 = require("./dto/create-client.dto");
const client_entity_1 = require("./entities/client.entity");
const id_type_enum_1 = require("./entities/enum/id_type.enum");
const metal_currency_enum_1 = require("../currency-rate/entities/enum/metal_currency.enum");
const balance_entity_1 = require("../balance/entities/balance.entity");
const role_enum_1 = require("../guards/enum/role.enum");
const user_entity_1 = require("../user/entities/user.entity");
const SYNC_LOAD_LIMIT = 10;
let ClientService = class ClientService extends base_service_1.BaseService {
    constructor(mRepository, nexeroneService, balanceService, currencyRateService, configurationService, schedulerRegistry) {
        super();
        this.mRepository = mRepository;
        this.nexeroneService = nexeroneService;
        this.balanceService = balanceService;
        this.currencyRateService = currencyRateService;
        this.configurationService = configurationService;
        this.schedulerRegistry = schedulerRegistry;
        this.loadProfilesOffset = 0;
        this.loadBalancesOffset = 0;
        this.setSchedulerRegistry(schedulerRegistry);
    }
    async loadAndRegisterBytoken(token) {
        const responseResult = await this.nexeroneService.verifyClient(token);
        if (responseResult.error) {
            return responseResult;
        }
        return this.register(responseResult);
    }
    async loadAndRegister(email) {
        const responseResult = await this.nexeroneService.loadClientInfo(email);
        if (responseResult.error) {
            return responseResult;
        }
        const client = await this.register(responseResult);
        await this.balanceService.loadAndSaveClientBalances(client);
        return client;
    }
    async register(responseResult) {
        const client = new create_client_dto_1.CreateClientDto();
        client.customer_id = responseResult.CustomerID;
        client.username = responseResult.EmailAddress.toLowerCase();
        client.email = responseResult.EmailAddress.toLowerCase();
        client.phone = responseResult.MobilePhone;
        client.first_name = responseResult.FirstNames
            ? responseResult.FirstNames
            : "";
        client.last_name = responseResult.LastNames ? responseResult.LastNames : "";
        if (responseResult.ProfileImage &&
            responseResult.ProfileImage.includes("data:image/jpg;charset=utf8;base64,")) {
            const folder = "./uploads/client/";
            const filename = new Date().getTime() + ".jpg";
            client.photo = filename;
            this.save_base64_encoded_image(folder + filename, responseResult.ProfileImage);
        }
        client.status = responseResult.ProfileStatus;
        client.registered_at = responseResult.CreatedAt;
        client.title = responseResult.Title ? responseResult.Title : "";
        client.dob = responseResult.DateOfBirth ? responseResult.DateOfBirth : "";
        client.identification_type =
            responseResult.IdentificationType == "passport"
                ? id_type_enum_1.IdentificationType.Passport
                : id_type_enum_1.IdentificationType.IDCard;
        client.id_number = responseResult.IdentificationNumber
            ? responseResult.IdentificationNumber
            : "";
        client.country = responseResult.CountryResidence
            ? responseResult.CountryResidence
            : "";
        client.citizenship = responseResult.CountryCitizenship
            ? responseResult.CountryCitizenship
            : "";
        client.pa_address1 = responseResult.PhysicalAddressLine1
            ? responseResult.PhysicalAddressLine1
            : "";
        client.pa_address2 = responseResult.PhysicalAddressLine2
            ? responseResult.PhysicalAddressLine2
            : "";
        client.pa_city = responseResult.PhysicalAddressCity
            ? responseResult.PhysicalAddressCity
            : "";
        client.pa_state = responseResult.PhysicalAddressState
            ? responseResult.PhysicalAddressState
            : "";
        client.pa_zip = responseResult.PhysicalAddressPostalCode
            ? responseResult.PhysicalAddressPostalCode
            : "";
        client.pa_country = responseResult.PhysicalAddressCountry
            ? responseResult.PhysicalAddressCountry
            : "";
        client.ma_address1 = responseResult.MailingAddressLine1
            ? responseResult.MailingAddressLine1
            : "";
        client.ma_address2 = responseResult.MailingAddressLine2
            ? responseResult.MailingAddressLine2
            : "";
        client.ma_city = responseResult.MailingAddressCity
            ? responseResult.MailingAddressCity
            : "";
        client.ma_state = responseResult.MailingAddressState
            ? responseResult.MailingAddressState
            : "";
        client.ma_zip = responseResult.MailingAddressPostalCode
            ? responseResult.MailingAddressPostalCode
            : "";
        client.ma_country = responseResult.MailingAddressCountry
            ? responseResult.MailingAddressCountry
            : "";
        client.bank_system = responseResult.BankSystem ? responseResult.BankSystem : "";
        client.bank_token = responseResult.BankToken ? responseResult.BankToken : "";
        client.bank_other = responseResult.BankOther ? responseResult.BankOther : "";
        client.kyc_net_worth = responseResult.KycNetWorth;
        client.kyc_source_funds = responseResult.KycSourcefunds;
        client.kyc_profession = responseResult.KycProfession;
        client.kyc_video_link = responseResult.KycVideoLink;
        client.kyc_income = responseResult.KycIncome;
        client.kyc_other = responseResult.KycOtherKyc;
        client.crm_client_id = responseResult.CrmPersonClientId;
        client.crm_company_id = responseResult.CrmCompanyId;
        client.crm_username = responseResult.CrmUserName;
        client.crm_user_id = responseResult.CrmUserId;
        client.crm_user_token = responseResult.CrmUserToken;
        client.crm_email = responseResult.CrmEmailThreadId;
        client.currency = responseResult.Currency ? responseResult.Currency : 'EUR';
        const newClient = await this.createOrUpdate(client);
        return this.addUserFields(newClient);
    }
    async save_base64_encoded_image(filename, data) {
        if (!data)
            return;
        const base64Data = data.replace("data:image/jpg;charset=utf8;base64,", "");
        require("fs").writeFile(filename, base64Data, "base64", function (err) {
            this.consoleLog(err);
        });
    }
    async createOrUpdate(dto) {
        const client = await this.findOneByEmail(dto.email.toLowerCase());
        if (client) {
            return await this.update(client.id, dto);
        }
        else {
            return await this.create(dto);
        }
    }
    async create(dto) {
        const client = new client_entity_1.Client(dto);
        const errors = await class_validator_1.validate(client);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        else {
            const savedUser = await this.mRepository.save(client);
            return savedUser;
        }
    }
    async update(id, dto) {
        const client = new client_entity_1.Client(dto);
        client.id = id;
        await this.mRepository.save(client);
        return client;
    }
    async findAll() {
        return await this.mRepository.find();
    }
    async list(offset, limit) {
        return await this.mRepository.createQueryBuilder().take(limit).skip(offset).getMany();
    }
    async updateClientFees(data) {
        const client = await this.findOne(data.client_id);
        if (!client) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        client.fee_bps_gold = data.fee_bps_gold_coin;
        client.fee_bps_gold_bar = data.fee_bps_gold_bar;
        client.fee_au_bps_storage = data.fee_bps_gold_storage;
        client.fee_bps_silver = data.fee_bps_silver_coin;
        client.fee_bps_silver_bar = data.fee_bps_silver_bar;
        client.fee_ag_bps_storage = data.fee_bps_silver_storage;
        const uClient = await this.mRepository.save(client);
        return this.addUserFields(uClient);
    }
    async find_clients(displayCurrency, client_ids, include_holding = true) {
        const qb = this.mRepository
            .createQueryBuilder()
            .where("id IN (:...client_ids)", { client_ids });
        const clients = await qb.getMany();
        if (include_holding) {
            const result = [];
            for (const client of clients) {
                let uClient = this.addUserFields(client);
                uClient = await this.addHoldingAndCurrency(displayCurrency, uClient);
                result.push(uClient);
            }
            return result;
        }
        else {
            return clients;
        }
    }
    async find_clients_by_emails(displayCurrency, client_emails, include_holding = true) {
        const qb = this.mRepository
            .createQueryBuilder()
            .where("email IN (:...client_emails)", { client_emails });
        const clients = await qb.getMany();
        if (include_holding) {
            const result = [];
            for (const client of clients) {
                let uClient = this.addUserFields(client);
                uClient = await this.addHoldingAndCurrency(displayCurrency, uClient);
                result.push(uClient);
            }
            return result;
        }
        else {
            return clients;
        }
    }
    async find(client_ids, page, limit, status, search_key, displayCurrency) {
        const offset = (page - 1) * limit;
        const qb = this.mRepository.createQueryBuilder().where(new typeorm_2.Brackets((qb) => {
            qb.where("username like :search_key or first_name like :search_key or last_name like :search_key or email like :search_key or phone like :search_key", { search_key: `%${search_key}%` });
        }));
        if (client_ids.length > 0)
            qb.andWhere("id IN (:...client_ids)", { client_ids });
        if (status && status != "0")
            qb.andWhere("status = :status", { status });
        const clients = await qb.getMany();
        const allData = [];
        for (const user of clients) {
            const uUser = await this.addHoldingAndCurrency(displayCurrency, this.addUserFields(user));
            allData.push(uUser);
        }
        const total = allData.length;
        let result = [];
        if (total > limit) {
            result = allData.slice(offset, offset + limit);
        }
        else {
            result = allData;
        }
        return { total, clients: result, allData };
    }
    async addHoldingAndCurrency(displayCurrency, client) {
        const uClient = Object.assign({}, client);
        const balances = await this.balanceService.findClientBalances(client.id);
        const user = new user_entity_1.User();
        user.role = role_enum_1.Role.Admin;
        const companyCommission = await this.configurationService.getConfigurations(user);
        const mainBalances = this.getClientMainBalances(client, balances);
        const mb = Object.values(mainBalances);
        let total_holding = 0;
        for (const item of mb) {
            const commission = this.getCompanyCommission(companyCommission, item.type) + this.getAdivsorCommission(client, item.type);
            const cBalance = await this.currencyRateService.convertCurrency(item, displayCurrency, true, commission);
            if (cBalance)
                total_holding += parseFloat(cBalance.available_balance);
        }
        uClient.total_holding = total_holding;
        uClient.currency = displayCurrency;
        return uClient;
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async findOneByEmail(email) {
        return await this.mRepository.findOne({ email: email.toLowerCase() });
    }
    remove(id) {
        return `This action removes a #${id} client`;
    }
    async removeByEmails(emails) {
        return await this.mRepository
            .createQueryBuilder()
            .delete()
            .where("email IN (:...emails)", { emails })
            .execute();
    }
    addUserFields(client) {
        if (client.photo) {
            return Object.assign(Object.assign({}, client), { fullName: client.first_name + " " + client.last_name, avatar: config_local_1.urls.GS_MAIN_API_BASE_URL + 'nexerone/getProfileImage?user_id=' + client.customer_id });
        }
        else {
            return Object.assign(Object.assign({}, client), { fullName: client.first_name + " " + client.last_name, avatar: config_local_1.urls.GS_MAIN_API_BASE_URL + 'nexerone/getProfileImage?user_id=' + client.customer_id });
        }
    }
    getInvalidEmails(emails, clients) {
        const result = [];
        for (const email of emails) {
            let exist = false;
            for (const client of clients) {
                if (client.GetProfile &&
                    client.GetProfile.EmailAddress &&
                    email == client.GetProfile.EmailAddress) {
                    exist = true;
                }
            }
            if (!exist) {
                result.push(email);
            }
        }
        return result;
    }
    async advisor_overview(displayCurrency, client_emails, refresh) {
        const result = {
            Gold: {},
            Silver: {},
            Goldbar: {},
            Silverbar: {},
            Card: {
                type: balance_type_enum_1.BalanceType.Card,
                current_balance: 0.0,
                available_balance: 0.0
            },
        };
        const user = new user_entity_1.User();
        user.role = role_enum_1.Role.Admin;
        const companyCommission = await this.configurationService.getConfigurations(user);
        const clients = await this.find_clients_by_emails(displayCurrency, client_emails, false);
        let clientBalances = [];
        if (refresh == 1) {
            const nclients = await this.nexeroneService.loadClientsWithProfileAndBalances(client_emails);
            if (nclients.error) {
                return nclients;
            }
            for (let ci = 0; ci < nclients.length; ci++) {
                const client = nclients[ci];
                if (client.Profile && client.Balance) {
                    this.register(client.Profile);
                    const sclient = this.getClient(clients, client.Email);
                    if (sclient) {
                        const balances = await this.balanceService.saveClientBalances(sclient, client.Balance);
                        clientBalances = [...clientBalances, ...balances];
                    }
                    else {
                        this.consoleLog(client);
                    }
                }
                else {
                    this.balanceService.removeByEmail(client.Email);
                }
            }
        }
        else {
            clientBalances = await this.balanceService.findClientsBalances(client_emails);
        }
        for (const balance of clientBalances) {
            if (balance) {
                const client = clients.find(client => client.id == balance.client_id);
                if (client) {
                    const metalType = this.checkMainBalance(client, balance);
                    this.consoleLog(balance);
                    if (metalType) {
                        result[metalType]['type'] = metalType;
                        if (metalType == balance_type_enum_1.BalanceType.Card) {
                            result['Card']['current_balance'] = (result['Card']['current_balance'] ? result['Card']['current_balance'] : 0) + parseFloat('' + balance.current_balance) *
                                (await this.currencyRateService.getRate(balance.currency, displayCurrency));
                            result['Card']['available_balance'] = (result['Card']['available_balance'] ? result['Card']['available_balance'] : 0) + parseFloat('' + balance.available_balance) *
                                (await this.currencyRateService.getRate(balance.currency, displayCurrency));
                        }
                        else {
                            const commission = this.getCompanyCommission(companyCommission, metalType) + this.getAdivsorCommission(client, metalType);
                            const mainBalance = await this.currencyRateService.convertCurrency(balance, displayCurrency, true, commission);
                            result[metalType]['current_balance'] = (result[metalType]['current_balance'] ? result[metalType]['current_balance'] : 0) + parseFloat(mainBalance.current_balance);
                            result[metalType]['available_balance'] = (result[metalType]['available_balance'] ? result[metalType]['available_balance'] : 0) + parseFloat(mainBalance.available_balance);
                        }
                    }
                }
            }
        }
        return Object.values(result);
    }
    getCompanyCommission(fees, metalType) {
        if (metalType == balance_type_enum_1.BalanceType.Gold) {
            return parseFloat('' + fees.fee_sales_gold_coins);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Silver) {
            return parseFloat('' + fees.fee_sales_silver_coins);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Goldbar) {
            return parseFloat('' + fees.fee_sales_gold_bars);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Silverbar) {
            return parseFloat('' + fees.fee_sales_silver_bars);
        }
        return 0;
    }
    getAdivsorCommission(client, metalType) {
        if (metalType == balance_type_enum_1.BalanceType.Gold) {
            return parseFloat('' + client.fee_bps_gold);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Silver) {
            return parseFloat('' + client.fee_bps_silver);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Goldbar) {
            return parseFloat('' + client.fee_bps_gold_bar);
        }
        else if (metalType == balance_type_enum_1.BalanceType.Silverbar) {
            return parseFloat('' + client.fee_bps_silver_bar);
        }
        return 0;
    }
    getClient(clients, email) {
        for (const client of clients) {
            if (client.email.toLowerCase() == email.toLowerCase()) {
                return client;
            }
        }
        return null;
    }
    getClientMainBalances(client, balances) {
        const result = {};
        let bankOther = "EA";
        if (client.bank_other && (client.bank_other == "PA" || client.bank_other == "KS" || client.bank_other == "BB" || client.bank_other == "SV")) {
            bankOther = client.bank_other;
        }
        for (const balance of balances) {
            if (!balance)
                continue;
            if (balance.currency == metal_currency_enum_1.MetalCurrency.XAU) {
                result['Goldbar'] = balance;
            }
            if (balance.currency == metal_currency_enum_1.MetalCurrency.XAG) {
                result['Silverbar'] = balance;
            }
            if (balance.currency == "G" + bankOther) {
                result['Gold'] = balance;
            }
            if (balance.currency == "S" + bankOther) {
                result['Silver'] = balance;
            }
            if (balance.currency == "EUR" || balance.currency == "USD") {
                if (result['Card']) {
                    result['Card'].push(balance);
                }
                else {
                    result['Card'] = [balance];
                }
            }
        }
        return result;
    }
    checkMainBalance(client, balance) {
        if (balance.type == balance_type_enum_1.BalanceType.Card)
            return balance_type_enum_1.BalanceType.Card;
        let bankOther = "EA";
        if (client.bank_other && (client.bank_other == "PA" || client.bank_other == "KS" || client.bank_other == "BB" || client.bank_other == "SV")) {
            bankOther = client.bank_other;
        }
        if (balance.currency == metal_currency_enum_1.MetalCurrency.XAU) {
            return balance_type_enum_1.BalanceType.Goldbar;
        }
        if (balance.currency == metal_currency_enum_1.MetalCurrency.XAG) {
            return balance_type_enum_1.BalanceType.Silverbar;
        }
        if (balance.currency == "G" + bankOther) {
            return balance_type_enum_1.BalanceType.Gold;
        }
        if (balance.currency == "S" + bankOther) {
            return balance_type_enum_1.BalanceType.Silver;
        }
        if (balance.currency == "EUR" || balance.currency == "USD") {
            return balance_type_enum_1.BalanceType.Card;
        }
        return null;
    }
    async clientBalances(displayCurrency, client_id) {
        const client = await this.findOne(client_id);
        if (!client) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const response = await this.nexeroneService.loadClientBalancesWithProfitLoss(client.email);
        if (response.error) {
            return response;
        }
        const user = new user_entity_1.User();
        user.role = role_enum_1.Role.Admin;
        const companyCommission = await this.configurationService.getConfigurations(user);
        const balances = await this.balanceService.saveClientBalances(client, response.Balances);
        const mainBalances = this.getClientMainBalances(client, balances);
        let totalHolding = 0;
        const uBalances = [];
        const mb = Object.values(mainBalances);
        for (const item of mb) {
            if (Array.isArray(item)) {
                for (const card of item) {
                    card.current_balance = parseFloat('' + card.current_balance);
                    card.available_balance = parseFloat('' + card.available_balance);
                    if (card.type == balance_type_enum_1.BalanceType.Card) {
                        totalHolding += (await this.currencyRateService.convertCurrency(card, displayCurrency)).available_balance;
                    }
                    uBalances.push(card);
                }
            }
            else {
                item.current_balance = parseFloat('' + item.current_balance);
                item.available_balance = parseFloat('' + item.available_balance);
                if (item.type == balance_type_enum_1.BalanceType.Card) {
                    totalHolding += (await this.currencyRateService.convertCurrency(item, displayCurrency)).available_balance;
                }
                else {
                    const commission = this.getCompanyCommission(companyCommission, item.type) + this.getAdivsorCommission(client, item.type);
                    totalHolding += (await this.currencyRateService.convertCurrency(item, displayCurrency, true, commission)).available_balance;
                }
                uBalances.push(item);
            }
        }
        if (displayCurrency == 'EUR') {
            return {
                total_holding: totalHolding,
                balances: uBalances,
                profit_loss: response.ProfitLoss
            };
        }
        else {
            const uProfitLoss = [];
            const rate = await this.currencyRateService.getRate('EUR', displayCurrency);
            this.consoleLog(rate);
            for (const item of response.ProfitLoss) {
                const tempProfitLoss = Object.assign({}, item);
                if (item.accumulatedSales) {
                    tempProfitLoss.accumulatedSales = rate * parseFloat(item.accumulatedSales);
                }
                if (item.accumulatedPurchases) {
                    tempProfitLoss.accumulatedPurchases = rate * parseFloat(item.accumulatedPurchases);
                }
                if (item.averageCost) {
                    tempProfitLoss.averageCost = rate * parseFloat(item.averageCost);
                }
                if (item.profitLoss) {
                    tempProfitLoss.profitLoss = rate * parseFloat(item.profitLoss);
                }
                uProfitLoss.push(tempProfitLoss);
            }
            return {
                total_holding: totalHolding,
                balances: uBalances,
                profit_loss: uProfitLoss
            };
        }
    }
    async clientTransactions(account_number, start, end) {
        return await this.nexeroneService.loadClientTransactions(account_number, start, end);
    }
    async clientCardTransactions(card_number, card_currency, year, month) {
        return await this.nexeroneService.loadClientCardTransactions(card_number, card_currency, year, month);
    }
    async syncProfiles() {
        this.consoleLog('Called every day');
        const clients = await this.list(this.loadProfilesOffset, SYNC_LOAD_LIMIT);
        const clientEmails = [];
        clients.forEach((client) => {
            clientEmails.push(client.email);
        });
        const result = await this.nexeroneService.loadClientsProfiles(clientEmails);
        if (result.error) {
            this.consoleError(result.error);
        }
        else {
            for (let ci = 0; ci < result.length; ci++) {
                const profile = result[ci];
                if (profile.GetProfile) {
                    await this.register(profile.GetProfile);
                }
            }
        }
        if (clients.length == SYNC_LOAD_LIMIT) {
            this.loadProfilesOffset += SYNC_LOAD_LIMIT;
            await this.syncProfiles();
        }
        else {
            this.loadProfilesOffset = 0;
        }
    }
    async syncBalances() {
        this.consoleLog('Called every 10 mins');
        const clients = await this.list(this.loadBalancesOffset, SYNC_LOAD_LIMIT);
        const clientEmails = [];
        clients.forEach((client) => {
            clientEmails.push(client.email);
        });
        const result = await this.nexeroneService.loadClientsBalances(clientEmails);
        if (result.error) {
            this.consoleError(result.error);
        }
        else {
            for (let ci = 0; ci < result.length; ci++) {
                const client_balance = result[ci];
                if (client_balance.Balance) {
                    const client = this.getClient(clients, client_balance.Email);
                    if (client) {
                        await this.balanceService.saveClientBalances(client, client_balance.Balance);
                    }
                }
                else {
                    await this.balanceService.removeByEmail(client_balance.Email);
                }
            }
        }
        if (clients.length == SYNC_LOAD_LIMIT) {
            this.loadBalancesOffset += SYNC_LOAD_LIMIT;
            await this.syncBalances();
        }
        else {
            this.loadBalancesOffset = 0;
        }
    }
    async getFees(email) {
        const client = await this.findOneByEmail(email);
        this.consoleLog(client);
        if (client) {
            const user = {
                id: 0,
                role: role_enum_1.Role.User
            };
            const configs = await this.configurationService.getConfigurations(user);
            return {
                fee_bps_gold: parseFloat(configs.fee_sales_gold_coins) + client.fee_bps_gold,
                fee_bps_silver: parseFloat(configs.fee_sales_silver_coins) + client.fee_bps_silver,
                fee_bps_gold_bar: parseFloat(configs.fee_sales_gold_bars) + client.fee_bps_gold_bar,
                fee_bps_silver_bar: parseFloat(configs.fee_sales_silver_bars) + client.fee_bps_silver_bar,
            };
        }
        else {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmail };
        }
    }
};
ClientService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nexerone_service_1.NexeroneService,
        balance_service_1.BalanceService,
        currency_rate_service_1.CurrencyRateService,
        configuration_service_1.ConfigurationService,
        schedule_1.SchedulerRegistry])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map