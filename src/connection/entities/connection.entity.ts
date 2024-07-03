import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { CreateConnectionDto } from "../dto/create-connection.dto";

@Entity()
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  advisor_id: number;

  @Column({ unique: true })
  client_id: number;

  @Column({ unique: true })
  client_email: string;

  constructor(dto: CreateConnectionDto) {
    if (!dto) return;

    this.advisor_id = dto.advisor_id;
    this.client_email = dto.client_email;
  }
}
