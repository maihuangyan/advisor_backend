"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const online_module_1 = require("../online/online.module");
const message_module_1 = require("../message/message.module");
const user_module_1 = require("../user/user.module");
const room_module_1 = require("../room/room.module");
const auth_module_1 = require("../auth/auth.module");
const connection_module_1 = require("../connection/connection.module");
const client_module_1 = require("../client/client.module");
const nexerone_module_1 = require("../nexerone/nexerone.module");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            online_module_1.OnlineModule,
            user_module_1.UserModule,
            room_module_1.RoomModule,
            message_module_1.MessageModule,
            connection_module_1.ConnectionModule,
            client_module_1.ClientModule,
            nexerone_module_1.NexeroneModule,
        ],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map