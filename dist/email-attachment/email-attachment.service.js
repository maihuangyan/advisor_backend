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
exports.EmailAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const email_entity_1 = require("../email/entities/email.entity");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const email_attachment_entity_1 = require("./entities/email-attachment.entity");
let EmailAttachmentService = class EmailAttachmentService extends base_service_1.BaseService {
    constructor(mRepository) {
        super();
        this.mRepository = mRepository;
    }
    async create(dto) {
        const entity = new email_attachment_entity_1.EmailAttachment(dto);
        return await this.mRepository.save(entity);
    }
    async saveEmailAttachment(email, dto) {
        const entity = new email_attachment_entity_1.EmailAttachment(dto);
        entity.email = email;
        return await this.mRepository.save(entity);
    }
    async setAttachmentEmail(attachment, email) {
        const attachmentEntity = await this.mRepository.findOne({ filename: attachment });
        if (attachmentEntity) {
            attachmentEntity.email = email;
            return await this.mRepository.save(attachmentEntity);
        }
        else {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeEmailInvalidAttachment };
        }
    }
    findAll() {
        return `This action returns all emailAttachment`;
    }
    findOne(id) {
        return `This action returns a #${id} emailAttachment`;
    }
    update(id, updateEmailAttachmentDto) {
        return `This action updates a #${id} emailAttachment`;
    }
    remove(id) {
        return `This action removes a #${id} emailAttachment`;
    }
};
EmailAttachmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(email_attachment_entity_1.EmailAttachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmailAttachmentService);
exports.EmailAttachmentService = EmailAttachmentService;
//# sourceMappingURL=email-attachment.service.js.map