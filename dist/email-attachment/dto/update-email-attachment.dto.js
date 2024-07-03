"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailAttachmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_email_attachment_dto_1 = require("./create-email-attachment.dto");
class UpdateEmailAttachmentDto extends mapped_types_1.PartialType(create_email_attachment_dto_1.CreateEmailAttachmentDto) {
}
exports.UpdateEmailAttachmentDto = UpdateEmailAttachmentDto;
//# sourceMappingURL=update-email-attachment.dto.js.map