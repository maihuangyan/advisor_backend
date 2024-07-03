import { BaseController } from "src/_base/base.controller";
import { ZoomService } from "./zoom.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
export declare class ZoomController extends BaseController {
    private readonly zoomService;
    private readonly nexeronService;
    constructor(zoomService: ZoomService, nexeronService: NexeroneService);
    generateZoomAuthToken(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
}
