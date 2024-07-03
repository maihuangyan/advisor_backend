import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateWorkTimeDto } from "./dto/create-work-time.dto";
import { UpdateWorkTimeDto } from "./dto/update-work-time.dto";
import { WorkTime } from "./entities/work-time.entity";
export declare class WorkTimeService extends BaseService {
    private mRepository;
    constructor(mRepository: Repository<WorkTime>);
    create(dto: CreateWorkTimeDto): Promise<WorkTime | {
        error: number;
    }>;
    setWorkTimes(data: any): Promise<any>;
    find(user_id: number): Promise<any>;
    findOne(id: number): string;
    update(id: number, updateWorkTimeDto: UpdateWorkTimeDto): string;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
