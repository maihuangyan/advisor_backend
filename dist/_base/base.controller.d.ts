export declare class BaseController {
    response(result: any): {
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    };
    consoleLog(...args: any[]): void;
    consoleError(...args: any[]): void;
}
