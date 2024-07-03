import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { Role } from "src/guards/enum/role.enum";
import { Roles } from "src/guards/roles.decorator";
import { BaseController } from "src/_base/base.controller";
import { ConfigurationService } from "./configuration.service";
import { CreateConfigurationDto } from "./dto/create-configuration.dto";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";

@Controller("configuration")
export class ConfigurationController extends BaseController {
  constructor(private readonly configurationService: ConfigurationService) {
    super();
  }

  @Post()
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationService.create(createConfigurationDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.response(await this.configurationService.getConfigurations(req.user));
  }

  @Roles(Role.Admin)
  @Get("set_default_values")
  setDefaultValues() {
    this.configurationService.setDefaultValues();
    return this.response("success");
  }

  @Roles(Role.Admin)
  @Post("set_default_fees")
  setDefaultFees(@Request() req: any, @Body() data: any) {
    if (req.user.role == "admin") {
      this.configurationService.setDefaultFees(data);
      return this.response("success");
    }
  }

  @Post("update_email_footer")
  async updateEmailFooter(@Request() req: any, @Body() data: any): Promise<any> {
    if (req.user.role == "admin") {
      this.configurationService.updateEmailFooter(data.advisor_id, data.email_footer);
      return this.response("success");
    }
  }

  @Get("email_footer")
  async emailFooter(@Request() req: any) {
    return await this.configurationService.getEmailFooter(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.configurationService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch()
  update(@Body() dto: UpdateConfigurationDto) {
    return this.configurationService.update(dto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.configurationService.remove(+id);
  }
}
