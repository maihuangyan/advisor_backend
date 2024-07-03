"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionModule = void 0;
const common_1 = require("@nestjs/common");
const connection_service_1 = require("./connection.service");
const connection_controller_1 = require("./connection.controller");
const client_module_1 = require("../client/client.module");
const typeorm_1 = require("@nestjs/typeorm");
const connection_entity_1 = require("./entities/connection.entity");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const online_module_1 = require("../online/online.module");
const room_module_1 = require("../room/room.module");
const zoom_module_1 = require("../zoom/zoom.module");
let ConnectionModule = class ConnectionModule {
};
ConnectionModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([connection_entity_1.Connection]),
            client_module_1.ClientModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            online_module_1.OnlineModule,
            room_module_1.RoomModule,
            zoom_module_1.ZoomModule,
        ],
        controllers: [connection_controller_1.ConnectionController],
        providers: [connection_service_1.ConnectionService],
        exports: [connection_service_1.ConnectionService],
    })
], ConnectionModule);
exports.ConnectionModule = ConnectionModule;
//# sourceMappingURL=connection.module.js.map