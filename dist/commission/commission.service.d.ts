import { Commission } from './entities/commission.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/_base/base.service';
import { CurrencyRateService } from 'src/currency-rate/currency-rate.service';
import { BalanceService } from 'src/balance/balance.service';
import { UserService } from 'src/user/user.service';
export declare class CommissionService extends BaseService {
    private mRepository;
    private readonly currencyRateService;
    private readonly balanceService;
    private readonly userService;
    constructor(mRepository: Repository<Commission>, currencyRateService: CurrencyRateService, balanceService: BalanceService, userService: UserService);
    findOne(id: number): string;
    find(advisor_id: number, offset: number, limit: number, status: string, search_key: string): Promise<any[]>;
    advisor_overview(advisor_id: number, advisor_email: string, offset: number, limit: number): Promise<any>;
    getCommission(advisor_id: number, since: string, metalType: string, currency: string, status: string): Promise<number>;
    getMetalType(currency: string): string;
}
