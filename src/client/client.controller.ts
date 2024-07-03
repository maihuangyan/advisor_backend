/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { Public, Roles } from "src/guards/roles.decorator";
import { m_constants } from "src/utils/const";
import { BaseController } from "src/_base/base.controller";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { Role } from "src/guards/enum/role.enum";
import { UserService } from "src/user/user.service";

@Controller("client")
export class ClientController extends BaseController {
  constructor(
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super();
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get("search")
  async find(@Request() req: any, @Query() query: any) {
    const page = query.page;
    const limit = query.limit;
    const status = query.status;
    const search_key = query.q;
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
    return this.response(
      await this.clientService.find([], +page, +limit, status, search_key, displayCurrency)
    );
  }

  @Get("find_by_email")
  async findOneByEmail(@Query("email") email: string) {
    if (email) {
      const client = await this.clientService.findOneByEmail(email);
      if (client) {
        return this.response(this.clientService.addUserFields(client));
      } else {
        return this.response({
          error: m_constants.RESPONSE_ERROR.resCodeInvalidData,
        });
      }
    } else {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeInvalidData,
      });
    }
  }

  @Get("balances/:id")
  async balances(@Request() req: any, @Param("id") id: number) {
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
    if (isNaN(id) || id <= 0) {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeInvalidData,
      });
    }

    return this.response(await this.clientService.clientBalances(displayCurrency, id));
  }

  @Get("transactions")
  async transactions(@Query() params: any) {
    return this.response(
      await this.clientService.clientTransactions(
        params.account_number,
        params.start,
        params.end
      )
    );
  }

  @Get("card_transactions")
  async cardTransactions(@Query() params: any) {
    return this.response(
      await this.clientService.clientCardTransactions(
        params.card_number,
        params.card_currency,
        params.year,
        params.month
      )
    );
  }

  @Get("fees")
  async getFees(@Query("email") email: string) {
    this.consoleLog(email);
    return this.response(
      await this.clientService.getFees(email)
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.response(
      this.clientService.addUserFields(await this.clientService.findOne(+id))
    );
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CreateClientDto) {
    return this.clientService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clientService.remove(+id);
  }

  @Public()
  @Get("photo/:filename")
  photo(@Param("filename") filename: string, @Res() res) {
    return res.sendFile(filename, { root: "uploads/client" });
  }

}
