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
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { BaseController } from "src/_base/base.controller";
import { m_constants } from "src/utils/const";
import { Public } from "src/guards/roles.decorator";
import { NexeroneService } from "src/nexerone/nexerone.service";

@Controller("event")
export class EventController extends BaseController {
  constructor(
    private readonly eventService: EventService,
    private readonly nexeronService: NexeroneService
  ) {
    super();
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateEventDto) {
    const advisor_id = req.user.id;
    dto.advisor_id = advisor_id;
    return this.response(await this.eventService.create(dto));
  }

  @Get("check_scheduled_meeting") // for clients
  async checkScheduledMeeting(@Request() req: any) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        //return this.response(result);
      }
    }
    return this.response(
      await this.eventService.checkScheduledMeeting(req.user)
    );
  }

  @Get("available_time_slots") // for clients
  async timeSlots(@Request() req: any, @Query() data: any) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        return this.response(result);
      }
    }
    return this.response(
      await this.eventService.availableTimeSlots(req.user, data)
    );
  }

  @Post("schedule_meeting") // for clients
  async scheduleMeeting(@Request() req: any, @Body() data: any) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        return this.response(result);
      }
    }
    return this.response(
      await this.eventService.scheduleMeeting(req.user, data)
    );
  }

  @Post("cancel_meeting") // for clients
  async cancelMeeting(@Request() req: any, @Body() data: any) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        return this.response(result);
      }
    }
    const result = await this.eventService.cancelMeeting(req.user, data);
    if (result.affected) {
      return this.response("Success");
    }
    return this.response(result);
  }

  @Get()
  async findAdvisorEvents(@Request() req: any, @Query() query: any) {
    return this.response(
      await this.eventService.findAdvisorEvents(
        +req.user.id,
        Object.values(query)
      )
    );
  }

  @Public()
  @Get("test")
  async test(@Request() req: any) {
    return await this.eventService.eventsBetween(2, 1638417600, 1638885600);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.eventService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    return this.response(
      await this.eventService.update(req.user, +id, updateEventDto)
    );
  }

  @Delete(":id")
  async remove(@Request() req: any, @Param("id") id: string) {
    const result = await this.eventService.removeEvent(req.user, +id);
    if (result.error) {
      return this.response(result);
    }

    if (result.affected) {
      return this.response("Success");
    } else {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeUnknownError,
      });
    }
  }
}
