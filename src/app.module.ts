import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ChatModule } from "./chat/chat.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./guards/roles.guard";
import { MessageModule } from "./message/message.module";
import { RoomModule } from "./room/room.module";
import { OnlineModule } from "./online/online.module";
import { ClientModule } from "./client/client.module";
import { ConnectionModule } from "./connection/connection.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { EventModule } from "./event/event.module";
import { WorkTimeModule } from "./work-time/work-time.module";
import { ZoomModule } from "./zoom/zoom.module";
import { NexeroneModule } from "./nexerone/nexerone.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { BalanceModule } from "./balance/balance.module";
import { CurrencyRateModule } from "./currency-rate/currency-rate.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CoreModule } from "./core/core.module";
import { EmailModule } from "./email/email.module";
import { TypeOrmModules } from "./utils/config_local";
import { EmailAttachmentModule } from './email-attachment/email-attachment.module';
import { CommissionModule } from './commission/commission.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModules[0],
    TypeOrmModules[1],
    AuthModule,
    UserModule,
    ChatModule,
    MessageModule,
    RoomModule,
    OnlineModule,
    ClientModule,
    ConnectionModule,
    EventModule,
    WorkTimeModule,
    ZoomModule,
    NexeroneModule,
    ConfigurationModule,
    BalanceModule,
    CurrencyRateModule,
    ScheduleModule.forRoot(),
    EmailModule,
    EmailAttachmentModule,
    CommissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserModule, CoreModule],
})
export class AppModule {}
