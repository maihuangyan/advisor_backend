import { CreateConfigurationDto } from "../dto/create-configuration.dto";
import { UpdateConfigurationDto } from "../dto/update-configuration.dto";
export declare class Configuration {
    id: number;
    key: string;
    value: string;
    constructor(dto: CreateConfigurationDto);
    update(dto: UpdateConfigurationDto): void;
}
