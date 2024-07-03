import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateWorkTimeDto } from "./dto/create-work-time.dto";
import { UpdateWorkTimeDto } from "./dto/update-work-time.dto";
import { WorkTime } from "./entities/work-time.entity";

@Injectable()
export class WorkTimeService extends BaseService {
  constructor(
    @InjectRepository(WorkTime)
    private mRepository: Repository<WorkTime>
  ) {
    super();
  }

  async create(dto: CreateWorkTimeDto) {
    const errors = await validate(dto);
    this.consoleLog("errors", errors);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    if (dto.end <= dto.start || dto.end > 86400 || dto.start < 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    return await this.mRepository.save(new WorkTime(dto));
  }

  async setWorkTimes(data: any): Promise<any> {
    if (
      !Number.isInteger(+data.start1) ||
      !Number.isInteger(+data.end1) ||
      !Number.isInteger(+data.start2) ||
      !Number.isInteger(+data.end2) ||
      +data.start1 < 0 ||
      +data.start1 > 86400 ||
      +data.start2 < 0 ||
      +data.start2 > 86400 ||
      +data.end1 < 0 ||
      +data.end1 > 86400 ||
      +data.end2 < 0 ||
      +data.end2 > 86400 ||
      +data.start1 >= +data.end1 ||
      +data.start2 >= +data.end2 ||
      (+data.start1 <= +data.start2 && +data.start2 <= +data.end1) ||
      (+data.start2 <= +data.start1 && +data.start1 <= +data.end2) ||
      (+data.start1 <= +data.end2 && +data.end2 <= +data.end1) ||
      (+data.start2 <= +data.end1 && +data.end1 <= +data.end2)
    ) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const workTimes = await this.find(data.user_id);
    for (const workTime of workTimes) {
      await this.remove(workTime.id);
    }

    const result = [];
    result.push(
      await this.create(
        new CreateWorkTimeDto(data.user_id, data.start1, data.end1)
      )
    );
    result.push(
      await this.create(
        new CreateWorkTimeDto(data.user_id, data.start2, data.end2)
      )
    );
    return result;
  }

  async find(user_id: number): Promise<any> {
    if (isNaN(user_id)) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    return await this.mRepository.find({ user_id });
  }

  findOne(id: number) {
    return `This action returns a #${id} workTime`;
  }

  update(id: number, updateWorkTimeDto: UpdateWorkTimeDto) {
    return `This action updates a #${id} workTime`;
  }

  remove(id: number) {
    return this.mRepository.delete(id);
  }
}
