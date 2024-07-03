import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Forwardings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  forwarding: string;

  @Column()
  domain: string;

  @Column()
  dest_domain: string;

  @Column()
  is_maillist: number;

  @Column()
  is_list: number;

  @Column()
  is_forwarding: number;

  @Column()
  active: number;
}
