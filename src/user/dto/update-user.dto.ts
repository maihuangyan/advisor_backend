import { PartialType } from "@nestjs/mapped-types";
import { Role } from "../../guards/enum/role.enum";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  user_id: string;

  phone: string;

  first_name: string;

  last_name: string;

  photo: string;

  role: Role;

  timezone: string;

  verified_email: boolean;

  verified_phone: boolean;

  created_at: string;

  status: number;

  company: string;

  zoom_account_id: string;

  brief: string;

  date_of_birth: string;

  gender: string;

  forgot_password_code: string;

  start_time1: string;

  end_time1: string;

  start_time2: string;

  end_time2: string;

  currency: string;
}
