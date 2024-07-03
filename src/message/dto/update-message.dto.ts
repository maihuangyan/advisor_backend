import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageDto } from "./create-message.dto";

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  status: boolean;

  seen_status: number;

  deleted_at: string;

  advisor_deleted: number = -1;

  client_deleted: number = -1;
}
