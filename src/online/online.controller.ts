import { Controller, Get, Headers, Request } from '@nestjs/common';
import { Role } from 'src/guards/enum/role.enum';
import { Roles } from 'src/guards/roles.decorator';
import { BaseController } from 'src/_base/base.controller';
import { OnlineService } from './online.service';

@Controller('online')
export class OnlineController extends BaseController {

  constructor(private readonly onlineService: OnlineService) {
    super();
  }

  @Roles(Role.Admin)
  @Get('all')
  all() {
    return this.response(this.onlineService.getRooms())
  }

  @Get('list')
  list(@Request() req: any) {
    const advisor_id = req.user.id;
    return this.response(this.onlineService.getAdvisorRoomsOnlineStatus(advisor_id))
  }

  @Get('check')
  check(@Headers() headers: any) {
    const token = headers.authorization.replace('Bearer ','')
    return this.response(this.onlineService.getUserByToken(token))
  }

}
