import { SchedulerRegistry } from "@nestjs/schedule";
import { BalanceService } from "src/balance/balance.service";
import { BalanceType } from "src/balance/entities/enum/balance_type.enum";
import { ConfigurationService } from "src/configuration/configuration.service";
import { CurrencyRateService } from "src/currency-rate/currency-rate.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client } from "./entities/client.entity";
import { Balance } from "src/balance/entities/balance.entity";
export declare class ClientService extends BaseService {
    private mRepository;
    private readonly nexeroneService;
    private readonly balanceService;
    private readonly currencyRateService;
    private readonly configurationService;
    private schedulerRegistry;
    private loadProfilesOffset;
    private loadBalancesOffset;
    constructor(mRepository: Repository<Client>, nexeroneService: NexeroneService, balanceService: BalanceService, currencyRateService: CurrencyRateService, configurationService: ConfigurationService, schedulerRegistry: SchedulerRegistry);
    loadAndRegisterBytoken(token: string): Promise<any>;
    loadAndRegister(email: string): Promise<any>;
    register(responseResult: any): Promise<any>;
    save_base64_encoded_image(filename: string, data: string): Promise<void>;
    createOrUpdate(dto: CreateClientDto): Promise<Client>;
    create(dto: CreateClientDto): Promise<any>;
    update(id: number, dto: CreateClientDto): Promise<Client>;
    findAll(): Promise<Client[]>;
    list(offset: number, limit: number): Promise<Client[]>;
    updateClientFees(data: any): Promise<any>;
    find_clients(displayCurrency: string, client_ids: number[], include_holding?: boolean): Promise<any[]>;
    find_clients_by_emails(displayCurrency: string, client_emails: string[], include_holding?: boolean): Promise<any[]>;
    find(client_ids: number[], page: number, limit: number, status: string, search_key: string, displayCurrency: string): Promise<{
        total: number;
        clients: any[];
        allData: any[];
    }>;
    addHoldingAndCurrency(displayCurrency: string, client: Client): Promise<any>;
    findOne(id: number): Promise<Client | null>;
    findOneByEmail(email: string): Promise<Client | null>;
    remove(id: number): string;
    removeByEmails(emails: string[]): Promise<import("typeorm").DeleteResult>;
    addUserFields(client: Client): any;
    getInvalidEmails(emails: Array<string>, clients: Array<any>): any[];
    advisor_overview(displayCurrency: string, client_emails: Array<string>, refresh: number): Promise<any>;
    getCompanyCommission(fees: any, metalType: BalanceType): number;
    getAdivsorCommission(client: Client, metalType: BalanceType): number;
    getClient(clients: Client[], email: string): Client;
    getClientMainBalances(client: Client, balances: Array<any>): any;
    checkMainBalance(client: Client, balance: Balance): BalanceType;
    clientBalances(displayCurrency: string, client_id: number): Promise<any>;
    clientTransactions(account_number: string, start: number, end: number): Promise<any>;
    clientCardTransactions(card_number: string, card_currency: string, year: string, month: string): Promise<any>;
    syncProfiles(): Promise<void>;
    syncBalances(): Promise<void>;
    getFees(email: string): Promise<any>;
}
