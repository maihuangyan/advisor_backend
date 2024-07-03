import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Public } from "src/guards/roles.decorator";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { BaseController } from "src/_base/base.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly nexeroneService: NexeroneService
  ) {
    super();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req: any) {
    const result = this.authService.login(req.user);
    return this.response(result);
  }

  @Public()
  @Post("register")
  async register(@Body() userData: CreateUserDto) {
    if (!userData.username) {
      userData.username = userData.email;
    }
    const result = await this.authService.register(userData);
    this.consoleLog(result);
    return this.response(result);
  }

  @Public()
  @Post("forgot_password")
  async forgotPassword(@Body() params: any) {
    const result = await this.authService.forgotPassword(params.email);
    return this.response(result);
  }

  @Public()
  @Post("reset_forgot_password")
  async resetForgotPassword(@Body() params: any) {
    const result = await this.authService.resetForgotPassword(params);
    return this.response(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("reset_password")
  async resetPassword(@Request() req: any, @Body() passwords: any) {
    const userID = req.user.id;
    const result = await this.authService.resetPassword(+userID, passwords);
    return this.response(result);
  }

  @Public()
  @Post("verify")
  async verify(@Body() token: any) {
    return this.response(await this.authService.verifyToken(token.token));
  }
}
