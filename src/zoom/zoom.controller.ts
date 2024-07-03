import { Controller, Get, Request } from "@nestjs/common";
import { Public } from "src/guards/roles.decorator";
import { BaseController } from "src/_base/base.controller";
import { ZoomService } from "./zoom.service";
import { NexeroneService } from "src/nexerone/nexerone.service";

@Controller("zoom")
export class ZoomController extends BaseController {
  constructor(
    private readonly zoomService: ZoomService,
    private readonly nexeronService: NexeroneService) {
    super();
  }

  @Public()
  @Get("auth_token")
  async generateZoomAuthToken(@Request() req: any) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        return this.response(result);
      }
    }
    return this.response(this.zoomService.generateJWT());
  }
}
