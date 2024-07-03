import { BaseController } from "src/_base/base.controller";
import { BalanceService } from "./balance.service";
export declare class BalanceController extends BaseController {
    private readonly balanceService;
    constructor(balanceService: BalanceService);
    cardCurrency(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
}
