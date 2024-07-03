import { IsNotEmpty } from "class-validator";

export class CreateConnectionDto {
  @IsNotEmpty()
  advisor_id: number;

  @IsNotEmpty()
  client_email: string;
}
