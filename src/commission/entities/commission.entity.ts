import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export class Commission {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  advisor_id: number;

  @Column()
  advisor_email: string;

  @Column()
  type: string;

  @Column()
  @IsEmail()
  client_email: string;

  @Column()
  client_customer_id: string;

  @Column()
  client_first_name: string;

  @Column()
  client_last_name: string;

  @Column()
  debit_account_id: string;

  @Column()
  debit_coin_currency: string;

  @Column()
  credit_account_id: string;

  @Column()
  credit_coin_currency: string;

  @Column({type: "decimal", precision: 10, scale: 5, default: 0})
  coin_amount: number;

  @Column({ default: null })
  buy_description: string;

  @Column()
  transaction_id: string;

  @Column({ default: "pending" })
  transaction_status: string;

  @Column({type: "decimal", precision: 10, scale: 5, default: 0})
  fee_amount: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_percent: number;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  error: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ default: true, nullable: true })
  status: boolean;

}
