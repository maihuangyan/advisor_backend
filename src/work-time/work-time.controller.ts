import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { WorkTimeService } from "./work-time.service";
import { CreateWorkTimeDto } from "./dto/create-work-time.dto";
import { UpdateWorkTimeDto } from "./dto/update-work-time.dto";
import { BaseController } from "src/_base/base.controller";
import { RolesGuard } from "src/guards/roles.guard";
import { Role } from "src/guards/enum/role.enum";
import { Roles } from "src/guards/roles.decorator";

@Controller("work-time")
export class WorkTimeController extends BaseController {
  constructor(private readonly workTimeService: WorkTimeService) {
    super();
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateWorkTimeDto) {
    return this.response(await this.workTimeService.create(dto));
  }

  @Roles(Role.Admin)
  @Post("set_work_times")
  async setWorkTimes(@Body() data: any) {
    return this.response(await this.workTimeService.setWorkTimes(data));
  }

  @Get(":id")
  async find(@Param("id") advisor_id: string) {
    return this.response(await this.workTimeService.find(+advisor_id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateWorkTimeDto) {
    return this.workTimeService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workTimeService.remove(+id);
  }
}
