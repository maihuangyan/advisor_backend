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
} from "@nestjs/common";
import { Role } from "src/guards/enum/role.enum";
import { Public, Roles } from "src/guards/roles.decorator";
import { m_constants } from "src/utils/const";
import { BaseController } from "src/_base/base.controller";
import { ConnectionService } from "./connection.service";
import { CreateConnectionDto } from "./dto/create-connection.dto";
import { UpdateConnectionDto } from "./dto/update-connection.dto";
import { UserService } from "src/user/user.service";

@Controller("connection")
//@Roles(Role.Admin)
export class ConnectionController extends BaseController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService,
  ) {
    super();
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() dto: CreateConnectionDto): Promise<any> {
    return this.response(await this.connectionService.create(dto));
  }

  @Roles(Role.Advisor)
  @Get("advisor_clients")
  async clients(@Request() req: any): Promise<any> {
    const advisor_id = req.user.id;
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
    return this.response(
      await this.connectionService.advisor_clients(displayCurrency, advisor_id)
    );
  }

  @Roles(Role.Advisor)
  @Get("advisor_overview")
  async advisorOverview(@Request() req: any, @Query() query: any): Promise<any> {
    const advisor_id = req.user.id;
    const advisor_email = req.user.email;
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
    const result = this.response(
      await this.connectionService.advisor_overview(displayCurrency, advisor_id, advisor_email, +query.refresh)
    );
    result['refresh'] = query.refresh;
    return result
  }

  @Roles(Role.Admin)
  @Delete("delete_advisor/:id")
  async deleteAdvisor(@Param("id") advisor_id: number): Promise<any> {
    return this.response(this.connectionService.deleteAdvisor(advisor_id));
  }

  @Get("search_clients") //this api is using for both of advisor and admin
  async search_clients(@Request() req: any, @Query() query: any): Promise<any> {
    const advisor_id = query.advisor_id;
    const page = query.page;
    const limit = query.limit;
    const status = query.status;
    const search_key = query.q;
    const displayCurrency = await this.userService.getAdvisorDisplayCurrency(req.user.id);
    return this.response(
      await this.connectionService.find(
        advisor_id,
        +page,
        +limit,
        status,
        search_key,
        displayCurrency
      )
    );
  }

  @Public()
  @Get("advisor_of_client")
  async findAdvisorByClientEmail(@Request() req: any): Promise<any> {
    //this.consoleLog('req.headers', req.headers.authorization);

    if (!req.headers.authorization) {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeNoToken,
      });
    }

    if (!req.headers.authorization.includes("Bearer ")) {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeInvalidToken,
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    return this.response(await this.connectionService.findByClient(token));
  }

  @Post("update_fees")
  async updateFees(@Request() req: any, @Body() data: any): Promise<any> {
    if (req.user.role == "admin") {
      return this.response(await this.connectionService.updateClientFees(data));
    }
    else {
      const connection = await this.connectionService.findConnection(
        req.user.id,
        data.client_id
      );
      if (connection) {
        return this.response(
          await this.connectionService.updateClientFees(data)
        );
      } else {
        return this.response({
          error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
        });
      }
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<any> {
    return await this.connectionService.findOne(+id);
  }

  @Patch(":id")
  @Roles(Role.Admin)
  update(@Param("id") id: string, @Body() dto: UpdateConnectionDto) {
    return this.connectionService.update(+id, dto);
  }

  @Delete(":id")
  @Roles(Role.Admin)
  remove(@Param("id") id: string) {
    return this.response(this.connectionService.remove(+id));
  }

  @Post("remove")
  @Roles(Role.Admin)
  async removeConnection(@Body() params: any) {
    return this.response(
      await this.connectionService.removeConnection(
        +params.advisor_id,
        +params.client_id
      )
    );
  }
}
