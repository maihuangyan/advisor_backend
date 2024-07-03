import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Email } from "src/email/entities/email.entity";
import { CreateEmailAttachmentDto } from "../dto/create-email-attachment.dto";

@Entity()
export class EmailAttachment {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Email, (email) => email.attachments, { nullable: true })
  email: Email

  @Column({ default: '' })
  filename: string;

  @Column({ default: '' })
  origin_filename: string;

  constructor(dto: CreateEmailAttachmentDto) {
    if (!dto) return;

    this.filename = dto.filename;
    this.origin_filename = dto.originalname;
  }

}
