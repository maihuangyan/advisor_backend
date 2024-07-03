import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty } from "class-validator";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsNotEmpty()
  id: number;
}
