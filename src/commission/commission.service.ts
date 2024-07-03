import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from './entities/commission.entity';
import { Brackets, MoreThan, Repository } from 'typeorm';
import { BaseService } from 'src/_base/base.service';
import { CurrencyRateService } from 'src/currency-rate/currency-rate.service';
import { convertMetalCurrency } from 'src/currency-rate/entities/enum/metal_currency.enum';
import { BalanceService } from 'src/balance/balance.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommissionService extends BaseService {

  constructor(
    @InjectRepository(Commission)
    private mRepository: Repository<Commission>,
    private readonly currencyRateService: CurrencyRateService,
    private readonly balanceService: BalanceService,
    private readonly userService: UserService,
  ) {
    super();
  }

  findOne(id: number) {
    return `This action returns a #${id} commission`;
  }

  async find(
    advisor_id: number,
    offset: number,
    limit: number,
    status: string,
    search_key: string
  ) {
    this.consoleLog('advisor_id', advisor_id)
    const qb = this.mRepository.createQueryBuilder().where(
      new Brackets((qb) => {
        qb.where(
          "(debit_account_id like :search_key or credit_account_id like :search_key or client_first_name like :search_key " +
          "or client_last_name like :search_key or client_email like :search_key or description) and advisor_id = :advisor_id and transaction_status = 'executed'",
          { search_key: `%${search_key}%`, advisor_id }
        );
      })
    ).orderBy('id', 'DESC').limit(limit).offset(offset);

    const commissions = await qb.getMany();
    const uCommissions = [];
    for (const item of commissions) {
      const uCommission = { ...item }
      uCommission['price'] = await this.currencyRateService.getPrice(convertMetalCurrency(item.credit_coin_currency), item.fee_amount, "EUR", true)
      this.consoleLog(uCommission['price'])
      uCommissions.push(uCommission)
    }
    return uCommissions;
  }

  async advisor_overview(advisor_id: number, advisor_email: string, offset: number, limit: number): Promise<any> {
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(advisor_id);
    this.consoleLog('displayCurrency', displayCurrency);

    const qb = this.mRepository.createQueryBuilder().where(
      new Brackets((qb) => {
        qb.where(
          "advisor_id = :advisor_id and transaction_status = 'executed' and type in ('buy', 'advisor_manage')",
          { advisor_id }
        );
      })
    ).orderBy('id', 'DESC').limit(limit).offset(offset);

    const commissions = await qb.getMany();
    const uCommissions = [];
    for (const item of commissions) {
      const uCommission = { ...item }
      uCommission['price'] = await this.currencyRateService.getPrice(convertMetalCurrency(item.credit_coin_currency), item.fee_amount, displayCurrency, true)
      uCommissions.push(uCommission)
    }
    const result = {
      commissions: uCommissions,
      year: null,
      month: null,
      pending: null,
    }

    if (offset == 0) {
      // load year or month sum
      const year = '' + new Date().getFullYear() + '-01-01 00:00:00'
      const yearGoldCommission = await this.getCommission(advisor_id, year, 'Gold', displayCurrency, 'executed');
      const yearSilverCommission = await this.getCommission(advisor_id, year, 'Silver', displayCurrency, 'executed');
      const yearGoldbarCommission = await this.getCommission(advisor_id, year, 'Goldbar', displayCurrency, 'executed');
      const yearSilverbarCommission = await this.getCommission(advisor_id, year, 'Silverbar', displayCurrency, 'executed');
      const yearCommission = {
        gold: yearGoldCommission,
        silver: yearSilverCommission,
        goldbar: yearGoldbarCommission,
        silverbar: yearSilverbarCommission
      }
      result.year = yearCommission

      const month = new Date().getMonth() + 1
      const monthStr = '' + new Date().getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-01 00:00:00'
      const monthGoldCommission = await this.getCommission(advisor_id, monthStr, 'Gold', displayCurrency, 'executed');
      const monthSilverCommission = await this.getCommission(advisor_id, monthStr, 'Silver', displayCurrency, 'executed');
      const monthGoldbarCommission = await this.getCommission(advisor_id, monthStr, 'Goldbar', displayCurrency, 'executed');
      const monthSilverbarCommission = await this.getCommission(advisor_id, monthStr, 'Silverbar', displayCurrency, 'executed');
      const monthCommission = {
        gold: monthGoldCommission,
        silver: monthSilverCommission,
        goldbar: monthGoldbarCommission,
        silverbar: monthSilverbarCommission
      }
      result.month = monthCommission

      const qb1 = this.mRepository.createQueryBuilder().where(
        new Brackets((qb) => {
          qb.where(
            "advisor_id = :advisor_id and transaction_status = 'pending' and type in ('buy', 'advisor_manage')",
            { advisor_id }
          );
        })
      ).orderBy('id', 'DESC');

      const pendingCommissions = await qb1.getMany();
      const uCommissions1 = [];
      for (const item of pendingCommissions) {
        const uCommission = { ...item }
        uCommissions1['price'] = await this.currencyRateService.getPrice(convertMetalCurrency(item.credit_coin_currency), item.fee_amount, displayCurrency, true)
        uCommissions1.push(uCommission)
      }
      const result1 = {
        commissions: uCommissions1,
        year: null,
        month: null
      }

      const yearGoldCommission1 = await this.getCommission(advisor_id, year, 'Gold', displayCurrency, 'pending');
      const yearSilverCommission1 = await this.getCommission(advisor_id, year, 'Silver', displayCurrency, 'pending');
      const yearGoldbarCommission1 = await this.getCommission(advisor_id, year, 'Goldbar', displayCurrency, 'pending');
      const yearSilverbarCommission1 = await this.getCommission(advisor_id, year, 'Silverbar', displayCurrency, 'pending');
      const yearCommission1 = {
        gold: yearGoldCommission1,
        silver: yearSilverCommission1,
        goldbar: yearGoldbarCommission1,
        silverbar: yearSilverbarCommission1
      }
      result1.year = yearCommission1

      const monthGoldCommission1 = await this.getCommission(advisor_id, monthStr, 'Gold', displayCurrency, 'pending');
      const monthSilverCommission1 = await this.getCommission(advisor_id, monthStr, 'Silver', displayCurrency, 'pending');
      const monthGoldbarCommission1 = await this.getCommission(advisor_id, monthStr, 'Goldbar', displayCurrency, 'pending');
      const monthSilverbarCommission1 = await this.getCommission(advisor_id, monthStr, 'Silverbar', displayCurrency, 'pending');
      const monthCommission1 = {
        gold: monthGoldCommission1,
        silver: monthSilverCommission1,
        goldbar: monthGoldbarCommission1,
        silverbar: monthSilverbarCommission1
      }
      result1.month = monthCommission1

      result.pending = result1
    }

    return result;
  }

  async getCommission(advisor_id: number, since: string, metalType: string, currency: string, status: string): Promise<number> {
    this.consoleLog(since)
    let currencies = ['GEA', 'GPA', 'GKS', 'GBB', 'GSV']
    if (metalType == 'Silver') {
      currencies = ['SEA', 'SPA', 'SKS', 'SBB']
    }
    else if (metalType == 'Goldbar') {
      currencies = ['XAU']
    }
    else if (metalType == 'Silverbar') {
      currencies = ['XAG']
    }

    let total = 0;
    const buys = await this.mRepository.createQueryBuilder()
      .select('credit_coin_currency')
      .where("advisor_id = :advisor_id", { advisor_id })
      .andWhere("status = 1")
      .andWhere("type IN (:...types)", { types: ['buy', 'advisor_manage'] })
      .andWhere("transaction_status = :status", { status })
      .andWhere({ created_at: MoreThan(since) })
      .andWhere("debit_coin_currency IN (:...currencies)", { currencies })
      .addSelect('SUM(fee_amount)', 'total_amount')
      .groupBy("credit_coin_currency")
      .getRawMany()
    this.consoleLog(buys)

    for (const row of buys) {
      total += await this.currencyRateService.getPrice(convertMetalCurrency(row.credit_coin_currency), row.total_amount, currency)
    }

    return total;
  }

  getMetalType(currency: string): string {
    if (currency == 'XAU') {
      return 'Goldbar'
    }
    else if (currency == 'XAG') {
      return 'Silverbar'
    }
    else if (currency == 'GEA' || currency == 'GPA' || currency == 'GKS' || currency == 'GBB' || currency == 'GSV') {
      return 'Gold'
    }
    else if (currency == 'SEA' || currency == 'SPA' || currency == 'SKS' || currency == 'SBB') {
      return 'Silver'
    }
    return '';
  }


}
