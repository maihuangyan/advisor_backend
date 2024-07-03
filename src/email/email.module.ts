import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { AuthMiddleware } from "src/common/middlewares/auth.middleware";
import { EmailAttachmentModule } from "src/email-attachment/email-attachment.module";

import { OnlineModule } from "src/online/online.module";
import { User } from "src/user/entities/user.entity";
import { editFileName } from "src/utils/utils";
import { CronJobService } from "./cron-job.service";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { Email } from "./entities/email.entity";
import { Forwardings } from "./entities/forwardings.entity1";
import { ConfigurationModule } from "src/configuration/configuration.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Email, User]),
    TypeOrmModule.forFeature([Forwardings], "vmailConnection"),
    OnlineModule,
    EmailAttachmentModule,
    ConfigurationModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "./uploads/files",
        storage: diskStorage({
          destination: "./uploads/files",
          filename: (req, file, cb) => {
            editFileName(req, file, cb);
          },
        }),
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, CronJobService],
  exports: [EmailService, CronJobService],
})
export class EmailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "email/api-send", method: RequestMethod.POST });
  }
}
