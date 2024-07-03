import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateConfigurationDto } from "./dto/create-configuration.dto";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
import { Configuration } from "./entities/configuration.entity";
export declare class ConfigurationService extends BaseService {
    private mRepository;
    constructor(mRepository: Repository<Configuration>);
    setDefaultValues(): void;
    setDefaultFees(fees: any): void;
    getEmailFooter(advisor_id: string): Promise<string>;
    updateEmailFooter(advisor_id: string, content: string): Promise<Configuration>;
    create(dto: CreateConfigurationDto): Promise<Configuration>;
    getConfigurations(user: any): Promise<any>;
    findOne(id: number): Promise<Configuration>;
    update(dto: UpdateConfigurationDto): Promise<Configuration>;
    remove(id: number): string;
}
