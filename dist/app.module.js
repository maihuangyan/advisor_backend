"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const chat_module_1 = require("./chat/chat.module");
const core_1 = require("@nestjs/core");
const roles_guard_1 = require("./guards/roles.guard");
const message_module_1 = require("./message/message.module");
const room_module_1 = require("./room/room.module");
const online_module_1 = require("./online/online.module");
const client_module_1 = require("./client/client.module");
const connection_module_1 = require("./connection/connection.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const event_module_1 = require("./event/event.module");
const work_time_module_1 = require("./work-time/work-time.module");
const zoom_module_1 = require("./zoom/zoom.module");
const nexerone_module_1 = require("./nexerone/nexerone.module");
const configuration_module_1 = require("./configuration/configuration.module");
const balance_module_1 = require("./balance/balance.module");
const currency_rate_module_1 = require("./currency-rate/currency-rate.module");
const schedule_1 = require("@nestjs/schedule");
const core_module_1 = require("./core/core.module");
const email_module_1 = require("./email/email.module");
const config_local_1 = require("./utils/config_local");
const email_attachment_module_1 = require("./email-attachment/email-attachment.module");
const commission_module_1 = require("./commission/commission.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            core_module_1.CoreModule,
            config_local_1.TypeOrmModules[0],
            config_local_1.TypeOrmModules[1],
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            message_module_1.MessageModule,
            room_module_1.RoomModule,
            online_module_1.OnlineModule,
            client_module_1.ClientModule,
            connection_module_1.ConnectionModule,
            event_module_1.EventModule,
            work_time_module_1.WorkTimeModule,
            zoom_module_1.ZoomModule,
            nexerone_module_1.NexeroneModule,
            configuration_module_1.ConfigurationModule,
            balance_module_1.BalanceModule,
            currency_rate_module_1.CurrencyRateModule,
            schedule_1.ScheduleModule.forRoot(),
            email_module_1.EmailModule,
            email_attachment_module_1.EmailAttachmentModule,
            commission_module_1.CommissionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
        exports: [user_module_1.UserModule, core_module_1.CoreModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map