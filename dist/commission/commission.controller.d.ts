import { CommissionService } from './commission.service';
import { BaseController } from 'src/_base/base.controller';
export declare class CommissionController extends BaseController {
    private readonly commissionService;
    constructor(commissionService: CommissionService);
    advisorCommissions(req: any, query: any): Promise<any>;
    findOne(id: string): string;
}
