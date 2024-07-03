import { IsNotEmpty } from "class-validator";
import { Calendar } from "../calendar.enum";

export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  start: string;

  end: string;

  @IsNotEmpty()
  calendar: Calendar;

  all_day: number;

  @IsNotEmpty()
  advisor_id: number;

  client_id: number;

  created_by: number = 0; // 0: by advisor, 1: by client

  //@IsNotEmpty()
  zoom_meeting_id: string;

  //@IsNotEmpty()
  zoom_meeting_password: string;

  //@IsNotEmpty()
  zoom_meeting_join_url: string;
}
