import { Module } from "@nestjs/common";
import { CurrencyRateService } from "./currency-rate.service";
import { CurrencyRateController } from "./currency-rate.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NexeroneModule } from "src/nexerone/nexerone.module";
import { CurrencyRate } from "./entities/currency-rate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate]), NexeroneModule],
  controllers: [CurrencyRateController],
  providers: [CurrencyRateService],
  exports: [CurrencyRateService],
})
export class CurrencyRateModule {}
