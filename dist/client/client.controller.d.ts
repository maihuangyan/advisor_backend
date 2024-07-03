import { BaseController } from "src/_base/base.controller";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UserService } from "src/user/user.service";
export declare class ClientController extends BaseController {
    private readonly clientService;
    private readonly userService;
    constructor(clientService: ClientService, userService: UserService);
    create(createClientDto: CreateClientDto): Promise<any>;
    findAll(): Promise<import("./entities/client.entity").Client[]>;
    find(req: any, query: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    findOneByEmail(email: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    balances(req: any, id: number): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    transactions(params: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    cardTransactions(params: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    getFees(email: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    findOne(id: string): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    update(id: string, dto: CreateClientDto): Promise<import("./entities/client.entity").Client>;
    remove(id: string): string;
    photo(filename: string, res: any): any;
}
