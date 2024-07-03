import { Controller, Get, Request, Query, Post, Body } from "@nestjs/common";
import { Role } from "src/guards/enum/role.enum";
import { Public, Roles } from "src/guards/roles.decorator";
import { BaseController } from "src/_base/base.controller";
import { NexeroneService } from "./nexerone.service";

@Controller("nexerone")
export class NexeroneController extends BaseController {
  constructor(private readonly nexeroneService: NexeroneService) {
    super();
  }

  @Public()
  @Post("verify")
  async verify(@Body() params: any) {
    return this.response(await this.nexeroneService.verifyToken(params.token));
  }

  @Roles(Role.Developer)
  @Get("token")
  async nexerone_token() {
    return this.response(await this.nexeroneService.getNexoroneToken());
  }

  @Public()
  @Get("test")
  async test(@Request() req: any) {
    return this.response(
      await this.nexeroneService.sendPushNotification(
        "yangyang88511@gmail.com",
        "Test",
        "Advisor sent you a new message"
      )
    );
  }
}
