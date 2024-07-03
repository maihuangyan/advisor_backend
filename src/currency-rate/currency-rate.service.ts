/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { BalanceType } from "src/balance/entities/enum/balance_type.enum";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateCurrencyRateDto } from "./dto/create-currency-rate.dto";
import { UpdateCurrencyRateDto } from "./dto/update-currency-rate.dto";
import { CurrencyRate } from "./entities/currency-rate.entity";
import { MetalCurrency } from "./entities/enum/metal_currency.enum";
import { Balance } from "src/balance/entities/balance.entity";

@Injectable()
export class CurrencyRateService extends BaseService {
  constructor(
    @InjectRepository(CurrencyRate)
    private mRepository: Repository<CurrencyRate>,
    private readonly nexeroneService: NexeroneService
  ) {
    super();
  }

  async createOrUpdate(dto: CreateCurrencyRateDto) {
    const entity = await this.findOne(dto.metal);
    if (entity) {
      this.update(entity.id, dto);
    } else {
      this.create(dto);
    }
  }

  async create(dto: CreateCurrencyRateDto) {
    const entity = new CurrencyRate(dto);
    return await this.mRepository.save(entity);
  }

  async findAll() {
    return await this.mRepository.find();
  }

  async findOne(metal: MetalCurrency) {
    return await this.mRepository.findOne({ metal });
  }

  async update(id: number, dto: CreateCurrencyRateDto) {
    const entity = new CurrencyRate(dto);
    entity.id = id;
    return await this.mRepository.save(entity);
  }

  remove(id: number) {
    return `This action removes a #${id} currencyRate`;
  }

  @Interval(300000)
  async handleInterval() {
    const response = await this.nexeroneService.loadCurrencyRates();
    if (!response.error) {
      for (const key of Object.keys(response)) {
        const dto = new CreateCurrencyRateDto(
          MetalCurrency[key],
          +response[key].USD.buy_price,
          +response[key].USD.sell_price,
          +response[key].EUR.buy_price,
          +response[key].EUR.sell_price,
          +response[key].CHF.buy_price,
          +response[key].CHF.sell_price,
          +response[key].GBP.buy_price,
          +response[key].GBP.sell_price
        );
        this.createOrUpdate(dto);
      }
    }
  }

  async convertCurrency (
    balance: any, // Balance
    currency: string, // EUR, USD or etc
    is_buy = true,
    commission = 0.0
  ): Promise<any> {
    balance.current_balance_origin = balance.current_balance;
    balance.available_balance_origin = balance.available_balance;

    //this.consoleLog(balance)
    if (balance.currency == currency) {
      balance.currency_market = currency;
      return balance;
    }

    const rate = await this.findOne(balance.currency);
    if (!rate) {
      balance.current_balance = balance.current_balance * (await this.getRate(balance.currency, currency))
      balance.available_balance = balance.available_balance * (await this.getRate(balance.currency, currency))
      balance.currency_market = currency;
      return balance;
    };

    const serviceCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];
    if (serviceCurrencies.includes(currency)) {
      if (is_buy) {
        balance.current_balance = parseFloat('' + balance.current_balance) * rate[currency.toLowerCase() + '_buy'];
        balance.available_balance = parseFloat('' + balance.available_balance) * rate[currency.toLowerCase() + '_buy'];
      }
      else {
        balance.current_balance = parseFloat('' + balance.current_balance) * rate[currency.toLowerCase() + '_sell'];
        balance.available_balance = parseFloat('' + balance.available_balance) * rate[currency.toLowerCase() + '_sell'];
      }
    }
    else {
      if (is_buy) {
        balance.current_balance = parseFloat('' + balance.current_balance) * rate.eur_buy * (await this.getRate('EUR', currency));
        balance.available_balance = parseFloat('' + balance.available_balance) * rate.eur_buy * (await this.getRate('EUR', currency));
      }
      else {
        balance.current_balance = parseFloat('' + balance.current_balance) * rate.eur_sell * (await this.getRate('EUR', currency));
        balance.available_balance = parseFloat('' + balance.available_balance) * rate.eur_sell * (await this.getRate('EUR', currency));
      }
    }

    if (balance.type == BalanceType.Goldbar || balance.type == BalanceType.Silverbar) {
      balance.current_balance = balance.current_balance / 32.1507;
      balance.available_balance = balance.available_balance / 32.1507;
    }

    // apply commission
    if (is_buy && commission > 0) {
      balance.current_balance = balance.current_balance * (100 + commission) / 100;
      balance.available_balance = balance.available_balance * (100 + commission) / 100;
    }

    balance.currency_market = currency;
    return balance;
  }

  async getPrice (
    coinCurrency: MetalCurrency,
    amount: number, // Metal Amount
    currency: string, // EUR or USD
    is_buy = true
  ): Promise<number> {
    const rate = await this.findOne(coinCurrency);
    //this.consoleLog(rate)
    if (!rate) return 0;

    const serviceCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];
    if (serviceCurrencies.includes(currency)) {
      if (is_buy) {
        return parseFloat('' + amount) * rate[currency.toLowerCase() + '_buy'];
      }
      else {
        return parseFloat('' + amount) * rate[currency.toLowerCase() + '_sell'];
      }
    }
    else {
      if (is_buy) {
        return parseFloat('' + amount) * rate.eur_buy * (await this.getRate('EUR', currency));
      }
      else {
        return parseFloat('' + amount) * rate.eur_sell * (await this.getRate('EUR', currency));
      }
    }
  }

  async getRate(sourceCurrency: string, targetCurrency: string) {
    const rate = await this.findOne(MetalCurrency.XAU);
    if (sourceCurrency == "USD") {
      if (targetCurrency == "EUR") {
        return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.usd_buy);
      } else if (targetCurrency == "GBP") {
        return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.usd_buy);
      } else if (targetCurrency == "CHF") {
        return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.usd_buy);
      }
    } else if (sourceCurrency == "EUR") {
      if (targetCurrency == "USD") {
        return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.eur_buy);
      } else if (targetCurrency == "GBP") {
        return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.eur_buy);
      } else if (targetCurrency == "CHF") {
        return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.eur_buy);
      }
    } else if (sourceCurrency == "GBP") {
      if (targetCurrency == "EUR") {
        return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.gbp_buy);
      } else if (targetCurrency == "USD") {
        return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.gbp_buy);
      } else if (targetCurrency == "CHF") {
        return parseFloat('' + rate.chf_buy) / parseFloat('' + rate.gbp_buy);
      }
    } else if (sourceCurrency == "CHF") {
      if (targetCurrency == "EUR") {
        return parseFloat('' + rate.eur_buy) / parseFloat('' + rate.chf_buy);
      } else if (targetCurrency == "GBP") {
        return parseFloat('' + rate.gbp_buy) / parseFloat('' + rate.chf_buy);
      } else if (targetCurrency == "USD") {
        return parseFloat('' + rate.usd_buy) / parseFloat('' + rate.chf_buy);
      }
    }

    return 1;
  }
}
