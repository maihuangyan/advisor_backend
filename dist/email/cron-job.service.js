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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const config_local_1 = require("../utils/config_local");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const email_entity_1 = require("./entities/email.entity");
const forwardings_entity1_1 = require("./entities/forwardings.entity1");
const fetchMail_1 = require("./services/fetchMail");
let CronJobService = class CronJobService extends base_service_1.BaseService {
    constructor(emailRepository, vmailRepository) {
        super();
        this.emailRepository = emailRepository;
        this.vmailRepository = vmailRepository;
        this.isFetching = false;
    }
    async fetchInbox() {
        if (this.isFetching)
            return;
        this.isFetching = true;
        const exceptions = [
            `postmaster@${config_local_1.MAIL_DOMAIN}`,
            `admin@${config_local_1.MAIL_DOMAIN}`,
            `orders@${config_local_1.MAIL_DOMAIN}`,
            `noreply@${config_local_1.MAIL_DOMAIN}`,
            `registrations@${config_local_1.MAIL_DOMAIN}`
        ];
        const rows = await this.vmailRepository.find({ active: 1 });
        for (const item of rows) {
            if (exceptions.includes(item.address)) {
                continue;
            }
            const count = await this.emailRepository.count({
                to: item.address,
                mailbox: const_1.m_constants.MAILBOX.inbox,
            });
            try {
                const messageArray = await fetchMail_1.fetchMail(item.address, "INBOX", count);
                this.consoleLog('cronjob - fetching ' + item.address, messageArray);
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
                    const errors = await class_validator_1.validate(inbox);
                    this.consoleLog("errors", errors);
                    if (errors.length > 0) {
                        return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
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
                this.consoleError(e);
            }
        }
        this.isFetching = false;
    }
};
CronJobService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(email_entity_1.Email)),
    __param(1, typeorm_1.InjectRepository(forwardings_entity1_1.Forwardings, "vmailConnection")),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CronJobService);
exports.CronJobService = CronJobService;
//# sourceMappingURL=cron-job.service.js.map