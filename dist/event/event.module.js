"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const event_service_1 = require("./event.service");
const event_controller_1 = require("./event.controller");
const typeorm_1 = require("@nestjs/typeorm");
const event_entity_1 = require("./entities/event.entity");
const connection_module_1 = require("../connection/connection.module");
const work_time_module_1 = require("../work-time/work-time.module");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const config_local_1 = require("../utils/config_local");
const zoom_module_1 = require("../zoom/zoom.module");
const nexerone_module_1 = require("../nexerone/nexerone.module");
let EventModule = class EventModule {
};
EventModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([event_entity_1.Event]),
            connection_module_1.ConnectionModule,
            work_time_module_1.WorkTimeModule,
            user_module_1.UserModule,
            zoom_module_1.ZoomModule,
            nexerone_module_1.NexeroneModule,
            jwt_1.JwtModule.register({
                secret: config_local_1.jwtConstants.secret,
                signOptions: { expiresIn: "3600s" },
            }),
        ],
        controllers: [event_controller_1.EventController],
        providers: [event_service_1.EventService],
    })
], EventModule);
exports.EventModule = EventModule;
//# sourceMappingURL=event.module.js.map