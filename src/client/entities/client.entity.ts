import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { IsEmail, IsPhoneNumber } from "class-validator";
import { CreateClientDto } from "../dto/create-client.dto";
import { UpdateClientDto } from "../dto/update-client.dto";
import { IdentificationType } from "./enum/id_type.enum";

@Entity()
export class Client {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  customer_id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: "" })
  phone: string;

  @Column({ default: "" })
  first_name: string;

  @Column({ default: "" })
  last_name: string;

  @Column({ default: "" })
  photo: string;

  @Column({ type: "text", default: "" })
  brief: string;

  @Column({ default: "", length: 10 })
  title: string;

  @Column({ default: "", length: 10 })
  dob: string;

  @Column({ default: IdentificationType.Passport })
  identification_type: IdentificationType;

  @Column({ default: "" })
  id_number: string;

  @Column({ default: "" })
  country: string;

  @Column({ default: "" })
  citizenship: string;

  @Column({ default: "" })
  pa_address1: string;

  @Column({ default: "" })
  pa_address2: string;

  @Column({ default: "" })
  pa_city: string;

  @Column({ default: "" })
  pa_state: string;

  @Column({ default: "" })
  pa_zip: string;

  @Column({ default: "" })
  pa_country: string;

  @Column({ default: "" })
  ma_address1: string;

  @Column({ default: "" })
  ma_address2: string;

  @Column({ default: "" })
  ma_city: string;

  @Column({ default: "" })
  ma_state: string;

  @Column({ default: "" })
  ma_zip: string;

  @Column({ default: "" })
  ma_country: string;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_bps_gold_bar: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_bps_silver_bar: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_bps_gold: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_bps_silver: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_au_bps_storage: number;

  @Column({ type: "decimal", precision: 7, scale: 3, default: 0 })
  fee_ag_bps_storage: number;

  @Column({ default: "active" })
  status: string;

  @Column({ default: "", nullable: true })
  bank_system: string;

  @Column({ default: "", nullable: true })
  bank_token: string;

  @Column({ default: "", nullable: true })
  bank_other: string;

  @Column()
  registered_at: string;

  @Column({ default: "", nullable: true })
  kyc_net_worth: string;

  @Column({ default: "", nullable: true })
  kyc_source_funds: string;

  @Column({ default: "", nullable: true })
  kyc_income: string;

  @Column({ default: "", nullable: true })
  kyc_profession: string;

  @Column({ default: "", nullable: true })
  kyc_video_link: string;

  @Column({ default: "", nullable: true })
  kyc_other: string;

  @Column({ default: "", nullable: true })
  crm_client_id: string;

  @Column({ default: "", nullable: true })
  crm_company_id: string;

  @Column({ default: "", nullable: true })
  crm_username: string;

  @Column({ default: "", nullable: true })
  crm_user_id: string;

  @Column({ default: "", nullable: true })
  crm_user_token: string;

  @Column({ default: "", nullable: true })
  crm_email: string;

  @Column({ default: "EUR", length: 10 })
  currency: string;

  constructor(dto: CreateClientDto) {
    if (!dto) return;

    this.username = dto.username;
    this.customer_id = dto.customer_id;
    this.email = dto.email;
    this.phone = dto.phone;
    this.first_name = dto.first_name;
    this.last_name = dto.last_name;
    this.photo = dto.photo;
    this.brief = dto.brief;
    this.status = dto.status;
    this.registered_at = dto.registered_at;

    this.title = dto.title;
    this.dob = dto.dob;
    this.identification_type = dto.identification_type;
    this.id_number = dto.id_number;
    this.country = dto.country;
    this.citizenship = dto.citizenship;

    this.pa_address1 = dto.pa_address1;
    this.pa_address2 = dto.pa_address2;
    this.pa_city = dto.pa_city;
    this.pa_state = dto.pa_state;
    this.pa_zip = dto.pa_zip;
    this.pa_country = dto.pa_country;

    this.ma_address1 = dto.ma_address1;
    this.ma_address2 = dto.ma_address2;
    this.ma_city = dto.ma_city;
    this.ma_state = dto.ma_state;
    this.ma_zip = dto.ma_zip;
    this.ma_country = dto.ma_country;

    this.fee_bps_gold = dto.fee_bps_gold;
    this.fee_bps_silver = dto.fee_bps_silver;
    this.fee_bps_gold_bar = dto.fee_bps_gold_bar;
    this.fee_ag_bps_storage = dto.fee_ag_bps_storage;
    this.fee_au_bps_storage = dto.fee_au_bps_storage;
    this.fee_bps_silver_bar = dto.fee_bps_silver_bar;

    this.bank_system = dto.bank_system;
    this.bank_token = dto.bank_token;
    this.bank_other = dto.bank_other;

    this.kyc_net_worth = dto.kyc_net_worth;
    this.kyc_source_funds = dto.kyc_source_funds;
    this.kyc_profession = dto.kyc_profession;
    this.kyc_video_link = dto.kyc_video_link;
    this.kyc_income = dto.kyc_income;
    this.kyc_other = dto.kyc_other;

    this.crm_client_id = dto.crm_client_id;
    this.crm_company_id = dto.crm_company_id;
    this.crm_username = dto.crm_username;
    this.crm_user_id = dto.crm_user_id;
    this.crm_user_token = dto.crm_user_token;
    this.crm_email = dto.crm_email;
  }

  getFullName(): string {
    if (this.first_name && this.last_name) {
      return this.first_name + " " + this.last_name;
    }
    if (this.first_name) {
      return this.first_name;
    }
    if (this.last_name) {
      return this.last_name;
    }
    return this.email;
  }
}
