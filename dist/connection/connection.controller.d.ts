import { BaseController } from "src/_base/base.controller";
import { ConnectionService } from "./connection.service";
import { CreateConnectionDto } from "./dto/create-connection.dto";
import { UpdateConnectionDto } from "./dto/update-connection.dto";
import { UserService } from "src/user/user.service";
export declare class ConnectionController extends BaseController {
    private readonly connectionService;
    private readonly userService;
    constructor(connectionService: ConnectionService, userService: UserService);
    create(dto: CreateConnectionDto): Promise<any>;
    clients(req: any): Promise<any>;
    advisorOverview(req: any, query: any): Promise<any>;
    deleteAdvisor(advisor_id: number): Promise<any>;
    search_clients(req: any, query: any): Promise<any>;
    findAdvisorByClientEmail(req: any): Promise<any>;
    updateFees(req: any, data: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateConnectionDto): Promise<import("./entities/connection.entity").Connection>;
    remove(id: string): {
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    };
    removeConnection(params: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
}
