import { BalanceType } from "../entities/enum/balance_type.enum";
export declare class CreateBalanceDto {
    client_id: number;
    client_email: string;
    type: BalanceType;
    account_number: number;
    currency: string;
    current_balance: number;
    available_balance: number;
    constructor(client_id: number, client_email: string, type: BalanceType, account_number: number, currency: string, current_balance: number, available_balance: number);
}
