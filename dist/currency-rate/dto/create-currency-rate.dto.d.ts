import { MetalCurrency } from "../entities/enum/metal_currency.enum";
export declare class CreateCurrencyRateDto {
    metal: MetalCurrency;
    usd_buy: number;
    usd_sell: number;
    eur_buy: number;
    eur_sell: number;
    chf_buy: number;
    chf_sell: number;
    gbp_buy: number;
    gbp_sell: number;
    constructor(metal: MetalCurrency, usd_buy: number, usd_sell: number, eur_buy: number, eur_sell: number, chf_buy: number, chf_sell: number, gbp_buy: number, gbp_sell: number);
}
