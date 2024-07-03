import { Controller, Get, Query, Request } from "@nestjs/common";
import { BaseController } from "src/_base/base.controller";
import { BalanceService } from "./balance.service";
import { Public } from "src/guards/roles.decorator";

@Controller("balance")
export class BalanceController extends BaseController {
  constructor(private readonly balanceService: BalanceService) {
    super();
  }

  @Get("card_currency")
  async cardCurrency(@Request() req: any) {
    const result = await this.balanceService.findClientCardBalance(req.user.email)
    return this.response(result);
  }

}
