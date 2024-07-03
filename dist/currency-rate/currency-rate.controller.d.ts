import { CurrencyRateService } from "./currency-rate.service";
import { CreateCurrencyRateDto } from "./dto/create-currency-rate.dto";
export declare class CurrencyRateController {
    private readonly currencyRateService;
    constructor(currencyRateService: CurrencyRateService);
    create(createCurrencyRateDto: CreateCurrencyRateDto): Promise<import("./entities/currency-rate.entity").CurrencyRate>;
    findAll(): Promise<import("./entities/currency-rate.entity").CurrencyRate[]>;
}
