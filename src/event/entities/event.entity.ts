import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { Calendar } from "../calendar.enum";
import { CreateEventDto } from "../dto/create-event.dto";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  zoom_meeting_id: string;

  @Column({ default: "" })
  zoom_meeting_password: string;

  @Column({ default: "" })
  zoom_meeting_join_url: string;

  @Column({ type: "varchar", length: 10, default: "0" })
  start: string;

  @Column({ type: "varchar", length: 10, default: "0" })
  end: string;

  @Column({
    type: "enum",
    enum: Calendar,
    default: Calendar.Personal,
  })
  calendar: Calendar;

  @Column({ type: "tinyint", width: 4, default: 0 }) // 1: all day
  all_day: number;

  @Column()
  advisor_id: number;

  @Column({ default: 0 })
  client_id: number;

  @Column({ type: "tinyint", width: 4, default: 0 }) // 0: by advisor, 1: by client
  created_by: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "tinyint", width: 4, default: 1 })
  status: number;

  constructor(dto: CreateEventDto) {
    if (!dto) return;

    this.title = dto.title;
    this.description = dto.description;
    this.start = dto.start;
    this.end = dto.end;
    this.calendar = dto.calendar;
    this.all_day = dto.all_day;
    this.advisor_id = dto.advisor_id;
    this.client_id = dto.client_id;
    this.zoom_meeting_id = dto.zoom_meeting_id;
    this.zoom_meeting_join_url = dto.zoom_meeting_join_url;
    this.zoom_meeting_password = dto.zoom_meeting_password;
  }
}
