"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const message_controller_1 = require("./message.controller");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("./entities/message.entity");
const multer_1 = require("multer");
const utils_1 = require("../utils/utils");
const room_module_1 = require("../room/room.module");
const online_module_1 = require("../online/online.module");
const client_module_1 = require("../client/client.module");
const user_module_1 = require("../user/user.module");
const nexerone_module_1 = require("../nexerone/nexerone.module");
const connection_module_1 = require("../connection/connection.module");
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message]),
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => ({
                    dest: "./uploads/message",
                    storage: multer_1.diskStorage({
                        destination: "./uploads/message",
                        filename: (req, file, cb) => {
                            utils_1.editFileName(req, file, cb);
                        },
                    }),
                }),
            }),
            room_module_1.RoomModule,
            online_module_1.OnlineModule,
            client_module_1.ClientModule,
            user_module_1.UserModule,
            nexerone_module_1.NexeroneModule,
            connection_module_1.ConnectionModule
        ],
        controllers: [message_controller_1.MessageController],
        providers: [message_service_1.MessageService],
        exports: [message_service_1.MessageService],
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map