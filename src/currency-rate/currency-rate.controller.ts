import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CurrencyRateService } from "./currency-rate.service";
import { CreateCurrencyRateDto } from "./dto/create-currency-rate.dto";
import { UpdateCurrencyRateDto } from "./dto/update-currency-rate.dto";

@Controller("currency-rate")
export class CurrencyRateController {
  constructor(private readonly currencyRateService: CurrencyRateService) {}

  @Post()
  create(@Body() createCurrencyRateDto: CreateCurrencyRateDto) {
    return this.currencyRateService.create(createCurrencyRateDto);
  }

  @Get()
  findAll() {
    return this.currencyRateService.findAll();
  }
}
