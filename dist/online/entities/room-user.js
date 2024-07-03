"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomUser = void 0;
class RoomUser {
    constructor(token, user_id, room_id, socket_id) {
        this.token = token;
        this.user_id = user_id;
        this.room_id = room_id;
        this.socket_id = socket_id;
    }
}
exports.RoomUser = RoomUser;
//# sourceMappingURL=room-user.js.map