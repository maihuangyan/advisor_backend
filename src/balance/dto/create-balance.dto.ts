import { IsNotEmpty } from "class-validator";
import { BalanceType } from "../entities/enum/balance_type.enum";

export class CreateBalanceDto {
  @IsNotEmpty()
  client_id: number;

  @IsNotEmpty()
  client_email: string;

  @IsNotEmpty()
  type: BalanceType;

  @IsNotEmpty()
  account_number: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  current_balance: number;

  @IsNotEmpty()
  available_balance: number;

  constructor(
    client_id: number,
    client_email: string,
    type: BalanceType,
    account_number: number,
    currency: string,
    current_balance: number,
    available_balance: number
  ) {
    this.client_id = client_id;
    this.client_email = client_email;
    this.type = type;
    this.account_number = account_number;
    this.currency = currency;
    this.current_balance = current_balance;
    this.available_balance = available_balance;
  }
}
