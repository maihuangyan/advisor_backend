import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateWorkTimeDto } from "../dto/create-work-time.dto";

@Entity()
export class WorkTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ default: 0 })
  start: number;

  @Column({ default: 0 })
  end: number;

  constructor(dto: CreateWorkTimeDto) {
    if (!dto) return;
    this.user_id = dto.user_id;
    this.start = dto.start;
    this.end = dto.end;
  }
}
