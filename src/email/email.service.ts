import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import nodemailer from "nodemailer";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateEmailDto } from "./dto/create-email.dto";
import { Email } from "./entities/email.entity";
import { smtpConfig } from "src/utils/config_local";
import { EmailAttachmentService } from "src/email-attachment/email-attachment.service";
import { fetchMail } from "./services/fetchMail";
import { ConfigurationService } from "src/configuration/configuration.service";
import fs from 'fs';
import { getCurrentMilliSeconds } from "src/utils/utils";
import { CreateEmailAttachmentDto } from "src/email-attachment/dto/create-email-attachment.dto";

@Injectable()
export class EmailService extends BaseService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    private readonly emailAttachmentService: EmailAttachmentService,
    private readonly configurationService: ConfigurationService
  ) {
    super();
  }

  async create(advisorId: string, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any> {
    const emailFooter = await this.configurationService.getEmailFooter(advisorId);
    try {
      const newEmail = new Email();
      newEmail.name = dto.name;
      newEmail.from = dto.from;
      newEmail.to = dto.to;
      newEmail.subject = dto.subject;
      newEmail.textAsHtml = dto.content + '</br>' + emailFooter;
      newEmail.html = '';
      newEmail.mailbox = m_constants.MAILBOX.sent;
      newEmail.reply_on = dto.reply_on;
      const errors = await validate(newEmail);
      if (errors.length > 0) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      const updated = files.map((attachment) => {
        return {
          path: `./uploads/files/${attachment.filename}`,
        };
      });
      await this.sendMail(dto.from, dto.to, dto.subject, dto.content + '</br>' + emailFooter, dto.reply_on, updated);

      const savedEmail = await this.emailRepository.save(newEmail);
      files.map(async (attachment) => {
        await this.emailAttachmentService.saveEmailAttachment(savedEmail, {
          filename: attachment.filename,
          originalname: attachment.originalname
        });
      });

      return { mail: savedEmail };
    }
    catch (e) {
      console.error(e);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailSendError };
    }
  }

  sendMail(from: string, to: string, subject: string, content: string, reply_on: string, attachments: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      smtpConfig.auth.user = from;
      const transporter = nodemailer.createTransport(smtpConfig);
      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: content,
        html: content,
        attachments: attachments,
      };
      if (reply_on) {
        mailOptions['replyTo'] = to
        mailOptions['inReplyTo'] = reply_on
        mailOptions['references'] = [to]
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        }
        else {
          resolve(info);
        }
      });
    })
  }

  async getInbox(vmail: string): Promise<any> {
    try {
      await this.syncMails(vmail);

      return await this.emailRepository.find({
        select: ["id", "message_id", "flags", "from", "to", "subject", "date", "status"],
        where: {
          to: vmail,
          mailbox: m_constants.MAILBOX.inbox,
          deleted_at: null,
        },
        order: { id: "DESC" },
      });
    }
    catch (e) {
      console.error(e);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError }
    }
  }

  async syncMails(email: string): Promise<any> {
    const count = await this.emailRepository.count({
      to: email,
      mailbox: m_constants.MAILBOX.inbox,
    });

    try {
      const messageArray = await fetchMail(email, "INBOX", count);
      this.consoleLog('sync mail - fetching ' + email, messageArray)
      for (const item of messageArray) {
        const inbox = new Email();
        inbox.message_id = item.envelope.messageId;
        inbox.flags = JSON.stringify(item.flags);
        inbox.from = item.envelope.from[0].address;
        inbox.to = item.envelope.to[0].address;
        inbox.subject = item.body.subject;
        inbox.text = item.body.text;
        inbox.textAsHtml = item.body.textAsHtml;
        inbox.html = item.body.html;
        inbox.date = item.body.date;
        inbox.mailbox = m_constants.MAILBOX.inbox;

        this.consoleLog('sync mail - references ' + email, item.references)
        this.consoleLog('sync mail - replyTo ' + email, item.replyTo)

        const errors = await validate(inbox);
        if (errors.length > 0) {
          this.consoleLog("errors", errors);
          return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }

        const isExist = await this.emailRepository.count({
          message_id: item.envelope.messageId,
        });
        if (!isExist) {
          const email = await this.emailRepository.save(inbox);

          const attachments = item.body.attachments;
          this.consoleLog('attachments', attachments);
          for (const attachment of attachments) {
            if (attachment.type == 'attachment') {
              const filename = getCurrentMilliSeconds() + '_' + attachment.filename;
              const path = './uploads/files/' + filename
              if (attachment.content) {
                const result = await this.saveAttachment(path, attachment.content);
                if (result) {
                  const dto = new CreateEmailAttachmentDto()
                  dto.originalname = attachment.filename;
                  dto.filename = filename;
                  await this.emailAttachmentService.saveEmailAttachment(email, dto);
                }
              }
            }
          }
        }
      }
    }
    catch (e) {
      this.consoleError(e)
    }
  }

  async saveAttachment(filename: string, buffer: any): Promise<any> {
    const self = this;
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, Buffer.from(buffer), function (err) {
        if (err) {
          self.consoleError(err);
          return resolve(false);
        }

        self.consoleLog(`File created! - ${filename}`);
        resolve(true);
      });
    })
  }

  async getContent(id: number): Promise<any> {
    try {
      const inbox = await this.emailRepository.findOne({
        where: { id },
        relations: ['attachments']
      });

      await this.setReadUnread(id, 1);
      return inbox;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
  }

  async getSent(vmail: string): Promise<any> {
    try {
      const sentEmails = await this.emailRepository.find({
        //select: ["id", "subject", "to", "created_at", "attatchments"],
        where: {
          from: vmail,
          mailbox: m_constants.MAILBOX.sent,
        },
        order: {
          created_at: "DESC",
        },
      });
      return sentEmails;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
    }
  }

  async getDrafts(vmail: string): Promise<any> {
    try {
      const sentEmails = await this.emailRepository.find({
        select: ["id", "subject", "to", "created_at"],
        where: {
          from: vmail,
          mailbox: m_constants.MAILBOX.draft,
          deleted_at: null,
        },
        order: {
          created_at: "DESC",
        },
      });
      return sentEmails;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
    }
  }

  async getTrash(vmail: string): Promise<any> {
    try {
      const messageArray = await this.emailRepository.find({
        where: [
          {
            to: vmail,
            mailbox: m_constants.MAILBOX.trash,
            deleted_at: null,
          },
          {
            from: vmail,
            mailbox: m_constants.MAILBOX.trash,
            deleted_at: null,
          },
        ],
        order: { id: "DESC" },
      });

      return messageArray;
    }
    catch (e) {
      console.error(e);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
    }
  }

  async saveDraft(advisorId: string, files: Array<Express.Multer.File>, dto: CreateEmailDto): Promise<any> {
    const emailFooter = await this.configurationService.getEmailFooter(advisorId);
    try {
      const newEmail = new Email();
      newEmail.name = dto.name;
      newEmail.from = dto.from;
      newEmail.to = dto.to;
      newEmail.subject = dto.subject;
      newEmail.text = dto.content + '</br>' + emailFooter;
      newEmail.textAsHtml = dto.content + '</br>' + emailFooter;
      newEmail.html = dto.content + '</br>' + emailFooter;
      newEmail.mailbox = m_constants.MAILBOX.draft;

      const errors = await validate(newEmail);
      this.consoleLog("errors", errors);
      if (errors.length > 0) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      const savedItem = await this.emailRepository.save(newEmail);
      files.map(async (attachment) => {
        await this.emailAttachmentService.saveEmailAttachment(savedItem, {
          filename: attachment.filename,
          originalname: attachment.originalname
        });
      });

      return { mail: savedItem };
    }
    catch (e) {
      console.error(e);
      return { error: `Failed to send email: ${e}` };
    }
  }

  async sendDraft(mailId: number): Promise<any> {
    try {
      const mail = await this.emailRepository.findOne({
        where: { id: mailId },
        relations: ['attachments']
      });
      if (!mail) {
        return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidID }
      }

      const updated = mail.attachments.map((attachment) => {
        return {
          path: `./uploads/files/${attachment.filename}`,
        };
      });
      await this.sendMail(mail.from, mail.to, mail.subject, mail.textAsHtml, null, updated);

      mail.mailbox = "Sent";
      const savedEmail = await this.emailRepository.save(mail);
      return { mail: savedEmail };
    }
    catch (e) {
      console.error(e);
      return { error: `Failed to send email: ${e}` };
    }
  }

  async setReadUnread(mailId: number, status: number): Promise<any> {
    const row = await this.emailRepository.findOne(mailId);
    if (!row) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    row.status = status;
    await this.emailRepository.save(row);
    return status;
  }

  async trashOrDelete(mailId: number): Promise<any> {
    try {
      const row = await this.emailRepository.findOne({ id: mailId });
      if (!row) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      if (row.mailbox == m_constants.MAILBOX.draft || row.mailbox == m_constants.MAILBOX.trash) {
        row.deleted_at = new Date();
        await this.emailRepository.save(row);
      }
      else {
        row.mailbox = m_constants.MAILBOX.trash;
        await this.emailRepository.save(row);
      }

      return mailId;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async trash(mailId: number): Promise<any> {
    try {
      const row = await this.emailRepository.findOne({ id: mailId });
      if (!row) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      row.mailbox = m_constants.MAILBOX.trash;
      await this.emailRepository.save(row);

      return mailId;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async delete(mailId: number): Promise<any> {
    try {
      const row = await this.emailRepository.findOne({ id: mailId });
      if (!row) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      row.deleted_at = new Date();
      await this.emailRepository.save(row);

      return mailId;
    } catch (e) {
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async restore(advisorEmail: string, mailId: number): Promise<any> {
    try {
      const row = await this.emailRepository.findOne({ id: mailId });
      if (!row) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }

      if (row.from == advisorEmail) {
        row.mailbox = 'Sent';
      }
      else if (row.to == advisorEmail) {
        row.mailbox = 'INBOX';
      }
      else {
        row.mailbox = 'Drafts';
      }
      await this.emailRepository.save(row);

      return row.mailbox;
    }
    catch (e) {
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async trashMany(mailIds: string): Promise<any> {
    if (mailIds) {
      const mail_ids = mailIds.split(',');

      return await this.emailRepository
        .createQueryBuilder()
        .update()
        .set({ mailbox: m_constants.MAILBOX.trash })
        .where("id IN (:mail_ids)", { mail_ids })
        .execute();
    }
    else {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData }
    }
  }

  async deleteMany(mailIds: string): Promise<any> {
    if (mailIds) {
      const mail_ids = mailIds.split(',');
      this.consoleLog(mail_ids)

      return await this.emailRepository
        .createQueryBuilder()
        .update()
        .set({ deleted_at: new Date() })
        .where("id IN (:mail_ids)", { mail_ids })
        .execute();
    }
    else {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData }
    }
  }

  async saveAttachments(files: Array<Express.Multer.File>): Promise<any[]> {
    const response = [];
    if (files) {
      for (const file of files) {
        const fileReponse = {
          originalname: file.originalname,
          filename: file.filename,
        };
        await this.emailAttachmentService.create(fileReponse);
        response.push(fileReponse);
      }
    }

    return response;
  }

}
