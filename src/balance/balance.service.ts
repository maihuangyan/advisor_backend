/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Client } from "src/client/entities/client.entity";
import { CurrencyRateService } from "src/currency-rate/currency-rate.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { Balance } from "./entities/balance.entity";
import { BalanceType } from "./entities/enum/balance_type.enum";
import { getCoinType } from "src/utils/utils";
import { MetalCurrency } from "src/currency-rate/entities/enum/metal_currency.enum";

@Injectable()
export class BalanceService extends BaseService {

  constructor(
    @InjectRepository(Balance)
    private mRepository: Repository<Balance>,
    private readonly nexeroneService: NexeroneService,
    private readonly currencyRateService: CurrencyRateService
  ) {
    super();
  }

  async create(dto: CreateBalanceDto) {
    const balance = new Balance(dto);
    const errors = await validate(balance);
    this.consoleLog(errors);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    else {
      const newEntity = await this.mRepository.save(balance);
      this.consoleLog(newEntity);
      return newEntity;
    }
  }

  async findBalancesByClientIds(client_ids: Array<number>) {
    return await this.mRepository
      .createQueryBuilder()
      .where("client_id in (:...client_ids)", { client_ids })
      .getMany();
  }

  async findClientsBalances(client_emails: Array<string>) {
    return await this.mRepository
      .createQueryBuilder()
      .where("client_email in (:...client_emails)", { client_emails })
      .getMany();
  }

  async findClientBalances(client_id: number) {
    return await this.mRepository.find({ client_id });
  }

  async createOrUpdate(client: Client, data: any, type: BalanceType) {
    if (!data || !data.Currency || !data.AccountNumber) return;

    let currentBalance = 0
    if (data.CurrentBalance && typeof data.CurrentBalance === 'string' || data.CurrentBalance instanceof String) {
      const updated = data.CurrentBalance.replace(",", "").replace(" ", "")
      if (updated && !isNaN(parseFloat(updated))) {
        currentBalance = parseFloat(updated)
      }
    }
    let availableBalance = 0
    if (data.AvailableBalance && typeof data.AvailableBalance === 'string' || data.AvailableBalance instanceof String) {
      const updated = data.AvailableBalance.replace(",", "").replace(" ", "")
      if (updated && !isNaN(parseFloat(updated))) {
        availableBalance = parseFloat(updated)
      }
    }

    const entity = await this.findByClientEmailAndAccountNumber(client.email, data.AccountNumber);
    if (entity) {
      if (client.id) {
        entity.client_id = client.id;
      }
      entity.available_balance = availableBalance;
      entity.currency = data.Currency;
      entity.current_balance = currentBalance;
      entity.type = type;
      return await this.mRepository.save(entity);
    }
    else {
      const dto = new CreateBalanceDto(
        client.id,
        client.email,
        type,
        data.AccountNumber,
        data.Currency,
        currentBalance,
        availableBalance
      );
      const newEntity = new Balance(dto);
      return await this.mRepository.save(newEntity);
    }
  }

  getCurrencyDefaultType(type: BalanceType): string {
    switch (type) {
      case BalanceType.Gold:
        return "GEA";
      case BalanceType.Silver:
        return "SEA";
      case BalanceType.Goldbar:
        return "XAU";
      case BalanceType.Silverbar:
        return "XAG";
      case BalanceType.Card:
        return "EUR";
    }
  }

  async loadAndSaveClientBalances(client: Client) {
    const clientBalances = await this.nexeroneService.loadClientBalances(
      client.email.toLowerCase()
    );
    if (clientBalances.error) {
      return clientBalances;
    }

    return await this.saveClientBalances(client, clientBalances);
  }

  async convertClientBalancesWithCardCurrency(displayCurrency: string, balances: Array<Balance>) {
    const uBalances = [];
    for (const balance of balances) {
      const cBalance = await this.currencyRateService.convertCurrency(balance, displayCurrency)
      if (cBalance)
        uBalances.push(cBalance)
    }
    return uBalances;
  }

  async saveClientBalances(client: Client, clientBalances: any): Promise<Array<Balance>> {
    const result = [];
    const existClientBalances = await this.findClientBalances(client.id);
    for (const balance of existClientBalances) {
      if (balance.type == BalanceType.Card) {
        if (!clientBalances.Card || balance.currency != clientBalances.Card.Currency) {
          await this.remove(balance.id);
        }
      }
      else {
        const nBalance = clientBalances[balance.currency]
        if (!nBalance) {
          await this.remove(balance.id);
        }
      }
    }

    for (const [key, balance] of Object.entries(clientBalances)) {
      if (key == "Card") {
        this.consoleLog('card');
        this.consoleLog(balance);
        if (Array.isArray(balance)) {
          this.consoleLog('card1');
          for (const item of balance) {
            this.consoleLog('card2');
            result.push(await this.createOrUpdate(client, item, BalanceType.Card))
          }
        }
      }
      else if (Object.keys(MetalCurrency).includes(key)) {
        result.push(await this.createOrUpdate(client, balance, getCoinType(key)))
      }
    }

    return result;
  }

  async findByClientEmailAndCurrency(client_email: string, currency: string) {
    return this.mRepository.findOne({
      where: {
        client_email: client_email.toLowerCase(),
        currency,
      },
    });
  }

  async findByClientEmailAndAccountNumber(client_email: string, account_number: string) {
    return this.mRepository.findOne({
      where: {
        client_email: client_email.toLowerCase(),
        account_number,
      },
    });
  }

  async findClientCardBalance(client_email: string) {
    const qb = this.mRepository.createQueryBuilder()
      .where("currency IN (:...currencies)", { currencies: ['EUR', 'USD'] })
      .andWhere("client_email = :client_email", { client_email })
    return await qb.getOne();
  }

  async findOne(id: number) {
    return await this.mRepository.findOne(id);
  }

  async update(id: number, dto: UpdateBalanceDto) {
    const balance = await this.findOne(id);
    balance.account_number = dto.account_number
    balance.client_id = dto.client_id
    balance.client_email = dto.client_email.toLowerCase()
    balance.available_balance = dto.available_balance
    balance.current_balance = dto.current_balance
    balance.currency = dto.currency
    return await this.mRepository.save(balance)
  }

  async remove(id: number) {
    return await this.mRepository.delete(id);
  }

  async removeByEmail(email: string) {
    return await this.mRepository.delete({ client_email: email.toLowerCase() });
  }
}
