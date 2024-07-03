"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const email_entity_1 = require("./entities/email.entity");
const config_local_1 = require("../utils/config_local");
const email_attachment_service_1 = require("../email-attachment/email-attachment.service");
const fetchMail_1 = require("./services/fetchMail");
const configuration_service_1 = require("../configuration/configuration.service");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils/utils");
const create_email_attachment_dto_1 = require("../email-attachment/dto/create-email-attachment.dto");
let EmailService = class EmailService extends base_service_1.BaseService {
    constructor(emailRepository, emailAttachmentService, configurationService) {
        super();
        this.emailRepository = emailRepository;
        this.emailAttachmentService = emailAttachmentService;
        this.configurationService = configurationService;
    }
    async create(advisorId, files, dto) {
        const emailFooter = await this.configurationService.getEmailFooter(advisorId);
        try {
            const newEmail = new email_entity_1.Email();
            newEmail.name = dto.name;
            newEmail.from = dto.from;
            newEmail.to = dto.to;
            newEmail.subject = dto.subject;
            newEmail.textAsHtml = dto.content + '</br>' + emailFooter;
            newEmail.html = '';
            newEmail.mailbox = const_1.m_constants.MAILBOX.sent;
            newEmail.reply_on = dto.reply_on;
            const errors = await class_validator_1.validate(newEmail);
            if (errors.length > 0) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
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
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailSendError };
        }
    }
    sendMail(from, to, subject, content, reply_on, attachments) {
        return new Promise((resolve, reject) => {
            config_local_1.smtpConfig.auth.user = from;
            const transporter = nodemailer_1.default.createTransport(config_local_1.smtpConfig);
            const mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: content,
                html: content,
                attachments: attachments,
            };
            if (reply_on) {
                mailOptions['replyTo'] = to;
                mailOptions['inReplyTo'] = reply_on;
                mailOptions['references'] = [to];
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
    async getInbox(vmail) {
        try {
            await this.syncMails(vmail);
            return await this.emailRepository.find({
                select: ["id", "message_id", "flags", "from", "to", "subject", "date", "status"],
                where: {
                    to: vmail,
                    mailbox: const_1.m_constants.MAILBOX.inbox,
                    deleted_at: null,
                },
                order: { id: "DESC" },
            });
        }
        catch (e) {
            console.error(e);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
        }
    }
    async syncMails(email) {
        const count = await this.emailRepository.count({
            to: email,
            mailbox: const_1.m_constants.MAILBOX.inbox,
        });
        try {
            const messageArray = await fetchMail_1.fetchMail(email, "INBOX", count);
            this.consoleLog('sync mail - fetching ' + email, messageArray);
            for (const item of messageArray) {
                const inbox = new email_entity_1.Email();
                inbox.message_id = item.envelope.messageId;
                inbox.flags = JSON.stringify(item.flags);
                inbox.from = item.envelope.from[0].address;
                inbox.to = item.envelope.to[0].address;
                inbox.subject = item.body.subject;
                inbox.text = item.body.text;
                inbox.textAsHtml = item.body.textAsHtml;
                inbox.html = item.body.html;
                inbox.date = item.body.date;
                inbox.mailbox = const_1.m_constants.MAILBOX.inbox;
                this.consoleLog('sync mail - references ' + email, item.references);
                this.consoleLog('sync mail - replyTo ' + email, item.replyTo);
                const errors = await class_validator_1.validate(inbox);
                if (errors.length > 0) {
                    this.consoleLog("errors", errors);
                    return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
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
                            const filename = utils_1.getCurrentMilliSeconds() + '_' + attachment.filename;
                            const path = './uploads/files/' + filename;
                            if (attachment.content) {
                                const result = await this.saveAttachment(path, attachment.content);
                                if (result) {
                                    const dto = new create_email_attachment_dto_1.CreateEmailAttachmentDto();
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
            this.consoleError(e);
        }
    }
    async saveAttachment(filename, buffer) {
        const self = this;
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(filename, Buffer.from(buffer), function (err) {
                if (err) {
                    self.consoleError(err);
                    return resolve(false);
                }
                self.consoleLog(`File created! - ${filename}`);
                resolve(true);
            });
        });
    }
    async getContent(id) {
        try {
            const inbox = await this.emailRepository.findOne({
                where: { id },
                relations: ['attachments']
            });
            await this.setReadUnread(id, 1);
            return inbox;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
    }
    async getSent(vmail) {
        try {
            const sentEmails = await this.emailRepository.find({
                where: {
                    from: vmail,
                    mailbox: const_1.m_constants.MAILBOX.sent,
                },
                order: {
                    created_at: "DESC",
                },
            });
            return sentEmails;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
        }
    }
    async getDrafts(vmail) {
        try {
            const sentEmails = await this.emailRepository.find({
                select: ["id", "subject", "to", "created_at"],
                where: {
                    from: vmail,
                    mailbox: const_1.m_constants.MAILBOX.draft,
                    deleted_at: null,
                },
                order: {
                    created_at: "DESC",
                },
            });
            return sentEmails;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
        }
    }
    async getTrash(vmail) {
        try {
            const messageArray = await this.emailRepository.find({
                where: [
                    {
                        to: vmail,
                        mailbox: const_1.m_constants.MAILBOX.trash,
                        deleted_at: null,
                    },
                    {
                        from: vmail,
                        mailbox: const_1.m_constants.MAILBOX.trash,
                        deleted_at: null,
                    },
                ],
                order: { id: "DESC" },
            });
            return messageArray;
        }
        catch (e) {
            console.error(e);
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailSyncError };
        }
    }
    async saveDraft(advisorId, files, dto) {
        const emailFooter = await this.configurationService.getEmailFooter(advisorId);
        try {
            const newEmail = new email_entity_1.Email();
            newEmail.name = dto.name;
            newEmail.from = dto.from;
            newEmail.to = dto.to;
            newEmail.subject = dto.subject;
            newEmail.text = dto.content + '</br>' + emailFooter;
            newEmail.textAsHtml = dto.content + '</br>' + emailFooter;
            newEmail.html = dto.content + '</br>' + emailFooter;
            newEmail.mailbox = const_1.m_constants.MAILBOX.draft;
            const errors = await class_validator_1.validate(newEmail);
            this.consoleLog("errors", errors);
            if (errors.length > 0) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
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
    async sendDraft(mailId) {
        try {
            const mail = await this.emailRepository.findOne({
                where: { id: mailId },
                relations: ['attachments']
            });
            if (!mail) {
                return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidID };
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
    async setReadUnread(mailId, status) {
        const row = await this.emailRepository.findOne(mailId);
        if (!row) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        row.status = status;
        await this.emailRepository.save(row);
        return status;
    }
    async trashOrDelete(mailId) {
        try {
            const row = await this.emailRepository.findOne({ id: mailId });
            if (!row) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
            }
            if (row.mailbox == const_1.m_constants.MAILBOX.draft || row.mailbox == const_1.m_constants.MAILBOX.trash) {
                row.deleted_at = new Date();
                await this.emailRepository.save(row);
            }
            else {
                row.mailbox = const_1.m_constants.MAILBOX.trash;
                await this.emailRepository.save(row);
            }
            return mailId;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async trash(mailId) {
        try {
            const row = await this.emailRepository.findOne({ id: mailId });
            if (!row) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
            }
            row.mailbox = const_1.m_constants.MAILBOX.trash;
            await this.emailRepository.save(row);
            return mailId;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async delete(mailId) {
        try {
            const row = await this.emailRepository.findOne({ id: mailId });
            if (!row) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
            }
            row.deleted_at = new Date();
            await this.emailRepository.save(row);
            return mailId;
        }
        catch (e) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async restore(advisorEmail, mailId) {
        try {
            const row = await this.emailRepository.findOne({ id: mailId });
            if (!row) {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
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
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async trashMany(mailIds) {
        if (mailIds) {
            const mail_ids = mailIds.split(',');
            return await this.emailRepository
                .createQueryBuilder()
                .update()
                .set({ mailbox: const_1.m_constants.MAILBOX.trash })
                .where("id IN (:mail_ids)", { mail_ids })
                .execute();
        }
        else {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
    }
    async deleteMany(mailIds) {
        if (mailIds) {
            const mail_ids = mailIds.split(',');
            this.consoleLog(mail_ids);
            return await this.emailRepository
                .createQueryBuilder()
                .update()
                .set({ deleted_at: new Date() })
                .where("id IN (:mail_ids)", { mail_ids })
                .execute();
        }
        else {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
    }
    async saveAttachments(files) {
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
};
EmailService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(email_entity_1.Email)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_attachment_service_1.EmailAttachmentService,
        configuration_service_1.ConfigurationService])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map