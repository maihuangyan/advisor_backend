import { IsNotEmpty } from "class-validator";
import { MetalCurrency } from "../entities/enum/metal_currency.enum";

export class CreateCurrencyRateDto {
  @IsNotEmpty()
  metal: MetalCurrency;

  @IsNotEmpty()
  usd_buy: number;

  @IsNotEmpty()
  usd_sell: number;

  @IsNotEmpty()
  eur_buy: number;

  @IsNotEmpty()
  eur_sell: number;

  @IsNotEmpty()
  chf_buy: number;

  @IsNotEmpty()
  chf_sell: number;

  @IsNotEmpty()
  gbp_buy: number;

  @IsNotEmpty()
  gbp_sell: number;

  constructor(
    metal: MetalCurrency,
    usd_buy: number,
    usd_sell: number,
    eur_buy: number,
    eur_sell: number,
    chf_buy: number,
    chf_sell: number,
    gbp_buy: number,
    gbp_sell: number
  ) {
    this.metal = metal;
    this.usd_buy = usd_buy;
    this.usd_sell = usd_sell;
    this.eur_buy = eur_buy;
    this.eur_sell = eur_sell;
    this.chf_buy = chf_buy;
    this.chf_sell = chf_sell;
    this.gbp_buy = gbp_buy;
    this.gbp_sell = gbp_sell;
  }
}
