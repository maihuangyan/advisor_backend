import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceController } from "./balance.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NexeroneModule } from "src/nexerone/nexerone.module";
import { Balance } from "./entities/balance.entity";
import { CurrencyRateModule } from "src/currency-rate/currency-rate.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance]),
    NexeroneModule,
    CurrencyRateModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
