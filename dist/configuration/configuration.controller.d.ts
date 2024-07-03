import { BaseController } from "src/_base/base.controller";
import { ConfigurationService } from "./configuration.service";
import { CreateConfigurationDto } from "./dto/create-configuration.dto";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
export declare class ConfigurationController extends BaseController {
    private readonly configurationService;
    constructor(configurationService: ConfigurationService);
    create(createConfigurationDto: CreateConfigurationDto): Promise<import("./entities/configuration.entity").Configuration>;
    findAll(req: any): Promise<{
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    }>;
    setDefaultValues(): {
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    };
    setDefaultFees(req: any, data: any): {
        ResponseCode: any;
        ResponseMessage: any;
        ResponseResult: any;
    } | {
        ResponseCode: number;
        ResponseMessage: string;
        ResponseResult: any;
    };
    updateEmailFooter(req: any, data: any): Promise<any>;
    emailFooter(req: any): Promise<string>;
    findOne(id: string): Promise<import("./entities/configuration.entity").Configuration>;
    update(dto: UpdateConfigurationDto): Promise<import("./entities/configuration.entity").Configuration>;
    remove(id: string): string;
}
