import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: string;

  @Column()
  user_id: string; // email for clients

  @Column()
  local_id: string;

  @Column()
  message: string;

  @Column({ type: "tinyint", width: 4, default: 1 })
  type: number; // 1: text, 2: image, 3: file

  @Column({ type: "varchar", length: 13, default: "0" })
  created_at: string;

  @Column({ type: "varchar", length: 13, default: "0" })
  updated_at: string;

  @Column({ type: "varchar", length: 13, default: "0" })
  deleted_at: string;

  @Column({ type: "tinyint", width: 4, default: 1 })
  status: number;

  @Column({ type: "tinyint", width: 4, default: 0 })
  seen_status: number;

  @Column({ type: "tinyint", width: 4, default: 0 })
  advisor_deleted: number;

  @Column({ type: "tinyint", width: 4, default: 0 })
  client_deleted: number;
}
