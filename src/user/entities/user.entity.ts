import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { IsEmail, IsPhoneNumber } from "class-validator";
import { Role } from "../../guards/enum/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  ip_address: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: "" })
  vmail: string;

  @Column({ default: "" })
  phone: string;

  @Column({ default: "" })
  company: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.Advisor,
  })
  role: Role;

  @Column({ default: "" })
  photo: string;

  @Column({ default: "" })
  first_name: string;

  @Column({ default: "" })
  last_name: string;

  @Column({ default: "" })
  date_of_birth: string;

  @Column({ default: "male" })
  gender: string;

  @Column({ type: "text", default: "" })
  brief: string;

  @Column({ default: "" })
  zoom_account_id: string;

  @Column({ default: "(UTC) Edinburgh, London" })
  timezone: string; // text

  @Column({ default: false })
  verified_email: boolean;

  @Column({ default: false })
  verified_phone: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ default: -1 })
  status: number; //-1: pending, 0: inactive, 1: active

  @Column({ default: "" })
  forgot_password_code: string;

  @Column({ default: "EUR", length: 10 })
  currency: string;

  customer_id: string;
  registered_at: string;
  city: string;
  country: string;
  client_status: string;
}
