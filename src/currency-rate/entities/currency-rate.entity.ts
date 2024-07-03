import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { CreateCurrencyRateDto } from "../dto/create-currency-rate.dto";
import { MetalCurrency } from "./enum/metal_currency.enum";

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metal: MetalCurrency;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  usd_buy: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  usd_sell: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  eur_buy: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  eur_sell: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  chf_buy: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  chf_sell: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  gbp_buy: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  gbp_sell: number;

  constructor(dto: CreateCurrencyRateDto) {
    if (!dto) return;

    this.metal = dto.metal;
    this.usd_buy = dto.usd_buy;
    this.usd_sell = dto.usd_sell;
    this.eur_buy = dto.eur_buy;
    this.eur_sell = dto.eur_sell;
    this.chf_buy = dto.chf_buy;
    this.chf_sell = dto.chf_sell;
    this.gbp_buy = dto.gbp_buy;
    this.gbp_sell = dto.gbp_sell;
  }
}
