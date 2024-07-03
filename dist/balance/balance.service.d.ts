import { Client } from "src/client/entities/client.entity";
import { CurrencyRateService } from "src/currency-rate/currency-rate.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { Balance } from "./entities/balance.entity";
import { BalanceType } from "./entities/enum/balance_type.enum";
export declare class BalanceService extends BaseService {
    private mRepository;
    private readonly nexeroneService;
    private readonly currencyRateService;
    constructor(mRepository: Repository<Balance>, nexeroneService: NexeroneService, currencyRateService: CurrencyRateService);
    create(dto: CreateBalanceDto): Promise<Balance | {
        error: number;
    }>;
    findBalancesByClientIds(client_ids: Array<number>): Promise<Balance[]>;
    findClientsBalances(client_emails: Array<string>): Promise<Balance[]>;
    findClientBalances(client_id: number): Promise<Balance[]>;
    createOrUpdate(client: Client, data: any, type: BalanceType): Promise<Balance>;
    getCurrencyDefaultType(type: BalanceType): string;
    loadAndSaveClientBalances(client: Client): Promise<any>;
    convertClientBalancesWithCardCurrency(displayCurrency: string, balances: Array<Balance>): Promise<any[]>;
    saveClientBalances(client: Client, clientBalances: any): Promise<Array<Balance>>;
    findByClientEmailAndCurrency(client_email: string, currency: string): Promise<Balance>;
    findByClientEmailAndAccountNumber(client_email: string, account_number: string): Promise<Balance>;
    findClientCardBalance(client_email: string): Promise<Balance>;
    findOne(id: number): Promise<Balance>;
    update(id: number, dto: UpdateBalanceDto): Promise<Balance>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    removeByEmail(email: string): Promise<import("typeorm").DeleteResult>;
}
