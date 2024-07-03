import { WorkTimeService } from "./work-time.service";
import { CreateWorkTimeDto } from "./dto/create-work-time.dto";
import { UpdateWorkTimeDto } from "./dto/update-work-time.dto";
import { BaseController } from "src/_base/base.controller";
export declare class WorkTimeController extends BaseController {
    private readonly workTimeService;
    constructor(workTimeService: WorkTimeService);
    create(dto: CreateWorkTimeDto): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    setWorkTimes(data: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    find(advisor_id: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    update(id: string, dto: UpdateWorkTimeDto): string;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
