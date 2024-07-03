import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  advisor_id: number;

  @Column()
  client_id: string; // client email

  @Column()
  client_name: string;

  @Column({ default: "" })
  client_photo: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ default: true })
  status: boolean;
}
