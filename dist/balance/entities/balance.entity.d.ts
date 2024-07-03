import { CreateBalanceDto } from "../dto/create-balance.dto";
import { BalanceType } from "./enum/balance_type.enum";
export declare class Balance {
    id: number;
    client_id: number;
    client_email: string;
    type: BalanceType;
    account_number: number;
    currency: string;
    current_balance: number;
    available_balance: number;
    constructor(dto: CreateBalanceDto);
}
