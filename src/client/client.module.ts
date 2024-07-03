import { Module, forwardRef } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { NexeroneModule } from "src/nexerone/nexerone.module";
import { BalanceModule } from "src/balance/balance.module";
import { CurrencyRateModule } from "src/currency-rate/currency-rate.module";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    NexeroneModule,
    BalanceModule,
    CurrencyRateModule,
    ConfigurationModule,
    forwardRef(() => UserModule)
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
