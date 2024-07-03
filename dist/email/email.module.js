"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const multer_1 = require("multer");
const auth_middleware_1 = require("../common/middlewares/auth.middleware");
const email_attachment_module_1 = require("../email-attachment/email-attachment.module");
const online_module_1 = require("../online/online.module");
const user_entity_1 = require("../user/entities/user.entity");
const utils_1 = require("../utils/utils");
const cron_job_service_1 = require("./cron-job.service");
const email_controller_1 = require("./email.controller");
const email_service_1 = require("./email.service");
const email_entity_1 = require("./entities/email.entity");
const forwardings_entity1_1 = require("./entities/forwardings.entity1");
const configuration_module_1 = require("../configuration/configuration.module");
let EmailModule = class EmailModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: "email/api-send", method: common_1.RequestMethod.POST });
    }
};
EmailModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_entity_1.Email, user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([forwardings_entity1_1.Forwardings], "vmailConnection"),
            online_module_1.OnlineModule,
            email_attachment_module_1.EmailAttachmentModule,
            configuration_module_1.ConfigurationModule,
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => ({
                    dest: "./uploads/files",
                    storage: multer_1.diskStorage({
                        destination: "./uploads/files",
                        filename: (req, file, cb) => {
                            utils_1.editFileName(req, file, cb);
                        },
                    }),
                }),
            }),
        ],
        controllers: [email_controller_1.EmailController],
        providers: [email_service_1.EmailService, cron_job_service_1.CronJobService],
        exports: [email_service_1.EmailService, cron_job_service_1.CronJobService],
    })
], EmailModule);
exports.EmailModule = EmailModule;
//# sourceMappingURL=email.module.js.map