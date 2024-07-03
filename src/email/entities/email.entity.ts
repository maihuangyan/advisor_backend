import { EmailAttachment } from "src/email-attachment/entities/email-attachment.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  message_id: string;

  @Column({ default: "" })
  flags: string;

  @Column({ default: "" })
  name: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ default: "" })
  subject: string;

  @Column({ type: "longtext", default: null })
  text: string;

  @Column({ type: "longtext", default: "" })
  textAsHtml: string;

  @Column({ type: "longtext", default: "" })
  html: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column()
  mailbox: string;

  @Column({ default: null })
  reply_on: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => EmailAttachment, (attachment) => attachment.email)
  attachments: EmailAttachment[]

  @Column({ type: "tinyint", width: 1, default: 0 }) // 0: unread, 1: read
  status: number;

}
