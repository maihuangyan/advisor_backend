"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessageDto = void 0;
class CreateMessageDto {
    constructor(room_id, user_id, local_id, message, type) {
        this.room_id = room_id;
        this.user_id = user_id;
        this.local_id = local_id;
        this.message = message;
        this.type = type;
    }
}
exports.CreateMessageDto = CreateMessageDto;
//# sourceMappingURL=create-message.dto.js.map