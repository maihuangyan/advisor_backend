export declare class Commission {
    id: number;
    advisor_id: number;
    advisor_email: string;
    type: string;
    client_email: string;
    client_customer_id: string;
    client_first_name: string;
    client_last_name: string;
    debit_account_id: string;
    debit_coin_currency: string;
    credit_account_id: string;
    credit_coin_currency: string;
    coin_amount: number;
    buy_description: string;
    transaction_id: string;
    transaction_status: string;
    fee_amount: number;
    fee_percent: number;
    description: string;
    error: string;
    created_at: Date;
    status: boolean;
}
