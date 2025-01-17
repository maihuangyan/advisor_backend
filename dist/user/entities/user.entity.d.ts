import { Role } from "../../guards/enum/role.enum";
export declare class User {
    id: number;
    ip_address: string;
    username: string;
    email: string;
    vmail: string;
    phone: string;
    company: string;
    password: string;
    role: Role;
    photo: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    brief: string;
    zoom_account_id: string;
    timezone: string;
    verified_email: boolean;
    verified_phone: boolean;
    created_at: Date;
    status: number;
    forgot_password_code: string;
    currency: string;
    customer_id: string;
    registered_at: string;
    city: string;
    country: string;
    client_status: string;
}
