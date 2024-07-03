import { IsNotEmpty } from "class-validator";

export class CreateWorkTimeDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  start: number;

  @IsNotEmpty()
  end: number;

  constructor(user_id: number, start: number, end: number) {
    this.user_id = user_id;
    this.start = start;
    this.end = end;
  }
}
