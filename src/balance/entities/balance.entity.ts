import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
import { CreateBalanceDto } from "../dto/create-balance.dto";
import { BalanceType } from "./enum/balance_type.enum";

@Entity()
export class Balance {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  client_email: string;

  @Column()
  type: BalanceType;

  @Column({ default: 0 })
  account_number: number;

  @Column({ default: "" })
  currency: string;

  @Column({type: "decimal", precision: 15, scale: 5, default: 0})
  current_balance: number;

  @Column({type: "decimal", precision: 15, scale: 5, default: 0})
  available_balance: number;

  constructor(dto: CreateBalanceDto) {
    if (!dto) return;

    this.client_id = dto.client_id;
    this.client_email = dto.client_email.toLowerCase();
    this.type = dto.type;
    this.account_number = dto.account_number?dto.account_number:0;
    this.currency = dto.currency?dto.currency:'';
    this.current_balance = dto.current_balance;
    this.available_balance = dto.available_balance;
  }
}
