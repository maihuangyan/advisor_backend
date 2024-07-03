import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { BalanceModule } from 'src/balance/balance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './entities/commission.entity';
import { CurrencyRateModule } from 'src/currency-rate/currency-rate.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission]),
    CurrencyRateModule,
    BalanceModule,
    UserModule,
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService]
})
export class CommissionModule {}
