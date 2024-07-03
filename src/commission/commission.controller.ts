import { Controller, Request, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/enum/role.enum';
import { BaseController } from 'src/_base/base.controller';

@Controller('commission')
export class CommissionController extends BaseController {

  constructor(private readonly commissionService: CommissionService) {
    super()
  }

  @Roles(Role.Advisor)
  @Get("advisor_commissions")
  async advisorCommissions(@Request() req: any, @Query() query: any): Promise<any> {
    const advisor_id = req.user.id;
    const advisor_email = req.user.email;
    const result = this.response(
      await this.commissionService.advisor_overview(advisor_id, advisor_email, query.offset, query.limit)
    );
    return result
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionService.findOne(+id);
  }

}
