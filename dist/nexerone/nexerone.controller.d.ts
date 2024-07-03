import { BaseController } from "src/_base/base.controller";
import { NexeroneService } from "./nexerone.service";
export declare class NexeroneController extends BaseController {
    private readonly nexeroneService;
    constructor(nexeroneService: NexeroneService);
    verify(params: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    nexerone_token(): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    test(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
}
