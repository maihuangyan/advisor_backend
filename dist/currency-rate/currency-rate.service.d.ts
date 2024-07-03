import { NexeroneService } from "src/nexerone/nexerone.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateCurrencyRateDto } from "./dto/create-currency-rate.dto";
import { CurrencyRate } from "./entities/currency-rate.entity";
import { MetalCurrency } from "./entities/enum/metal_currency.enum";
export declare class CurrencyRateService extends BaseService {
    private mRepository;
    private readonly nexeroneService;
    constructor(mRepository: Repository<CurrencyRate>, nexeroneService: NexeroneService);
    createOrUpdate(dto: CreateCurrencyRateDto): Promise<void>;
    create(dto: CreateCurrencyRateDto): Promise<CurrencyRate>;
    findAll(): Promise<CurrencyRate[]>;
    findOne(metal: MetalCurrency): Promise<CurrencyRate>;
    update(id: number, dto: CreateCurrencyRateDto): Promise<CurrencyRate>;
    remove(id: number): string;
    handleInterval(): Promise<void>;
    convertCurrency(balance: any, currency: string, is_buy?: boolean, commission?: number): Promise<any>;
    getPrice(coinCurrency: MetalCurrency, amount: number, currency: string, is_buy?: boolean): Promise<number>;
    getRate(sourceCurrency: string, targetCurrency: string): Promise<number>;
}
