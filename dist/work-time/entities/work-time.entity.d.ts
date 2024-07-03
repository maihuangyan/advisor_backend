import { CreateWorkTimeDto } from "../dto/create-work-time.dto";
export declare class WorkTime {
    id: number;
    user_id: number;
    start: number;
    end: number;
    constructor(dto: CreateWorkTimeDto);
}
