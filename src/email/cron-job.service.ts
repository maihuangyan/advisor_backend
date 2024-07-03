import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { MAIL_DOMAIN } from "src/utils/config_local";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";

import { Email } from "./entities/email.entity";
import { Forwardings } from "./entities/forwardings.entity1";
import { fetchMail } from "./services/fetchMail";

@Injectable()
export class CronJobService extends BaseService {
  private isFetching = false;

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    @InjectRepository(Forwardings, "vmailConnection")
    private vmailRepository: Repository<Forwardings>
  ) {
    super();
  }

  //@Interval(30000)
  async fetchInbox(): Promise<any> {
    if (this.isFetching) return;
    this.isFetching = true;

    const exceptions = [
      `postmaster@${MAIL_DOMAIN}`,
      `admin@${MAIL_DOMAIN}`,
      `orders@${MAIL_DOMAIN}`,
      `noreply@${MAIL_DOMAIN}`,
      `registrations@${MAIL_DOMAIN}`
    ];
    const rows = await this.vmailRepository.find({ active: 1 });
    for (const item of rows) {
      if (exceptions.includes(item.address)) {
        continue;
      }
      const count = await this.emailRepository.count({
        to: item.address,
        mailbox: m_constants.MAILBOX.inbox,
      });

      try {
        const messageArray = await fetchMail(item.address, "INBOX", count);
        this.consoleLog('cronjob - fetching ' + item.address, messageArray)
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
          const errors = await validate(inbox);
          this.consoleLog("errors", errors);
          if (errors.length > 0) {
            return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
          }
          const isExist = await this.emailRepository.count({
            message_id: item.envelope.messageId,
          });
          if (!isExist) {
            await this.emailRepository.save(inbox);
          }
        }
      }
      catch (e) {
        this.consoleError(e)
      }
    }

    this.isFetching = false;
  }
}
