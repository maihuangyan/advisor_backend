import { IdentificationType } from "../entities/enum/id_type.enum";
export declare class CreateClientDto {
    username: string;
    customer_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    photo: string;
    brief: string;
    title: string;
    dob: string;
    identification_type: IdentificationType;
    id_number: string;
    country: string;
    citizenship: string;
    pa_address1: string;
    pa_address2: string;
    pa_city: string;
    pa_state: string;
    pa_zip: string;
    pa_country: string;
    ma_address1: string;
    ma_address2: string;
    ma_city: string;
    ma_state: string;
    ma_zip: string;
    ma_country: string;
    fee_bps_gold: number;
    fee_bps_silver: number;
    fee_bps_gold_bar: number;
    fee_bps_silver_bar: number;
    fee_au_bps_storage: number;
    fee_ag_bps_storage: number;
    bank_system: string;
    bank_token: string;
    bank_other: string;
    status: string;
    registered_at: string;
    kyc_net_worth: string;
    kyc_source_funds: string;
    kyc_income: string;
    kyc_profession: string;
    kyc_video_link: string;
    kyc_other: string;
    crm_client_id: string;
    crm_company_id: string;
    crm_username: string;
    crm_user_id: string;
    crm_user_token: string;
    crm_email: string;
    currency: string;
}
