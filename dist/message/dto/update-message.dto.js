"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMessageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_message_dto_1 = require("./create-message.dto");
class UpdateMessageDto extends mapped_types_1.PartialType(create_message_dto_1.CreateMessageDto) {
    constructor() {
        super(...arguments);
        this.advisor_deleted = -1;
        this.client_deleted = -1;
    }
}
exports.UpdateMessageDto = UpdateMessageDto;
//# sourceMappingURL=update-message.dto.js.map