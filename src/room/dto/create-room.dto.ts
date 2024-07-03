import { IsNotEmpty } from "class-validator";

export class CreateRoomDto {
  @IsNotEmpty()
  advisor_id: number;

  @IsNotEmpty()
  client_id: string; // client email

  @IsNotEmpty()
  client_name: string;

  client_photo: string;

  constructor(
    advisor_id: number,
    client_id: string,
    client_name: string,
    client_photo: string
  ) {
    this.advisor_id = advisor_id;
    this.client_id = client_id;
    this.client_name = client_name;
    this.client_photo = client_photo;
  }
}
