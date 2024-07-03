import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/_base/base.service";
import { Any, Repository } from "typeorm";
import { CreateConfigurationDto } from "./dto/create-configuration.dto";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
import { Configuration } from "./entities/configuration.entity";
import { Role } from "src/guards/enum/role.enum";

@Injectable()
export class ConfigurationService extends BaseService {
  constructor(
    @InjectRepository(Configuration)
    private mRepository: Repository<Configuration>
  ) {
    super();
  }

  setDefaultValues() {
    let dto = new CreateConfigurationDto("fee_sales_gold_coins", "280");
    this.update(dto);
    dto = new CreateConfigurationDto("fee_sales_gold_bars", "25");
    this.update(dto);
    dto = new CreateConfigurationDto("fee_year_gold_store_manage", "20");
    this.update(dto);
    dto = new CreateConfigurationDto("fee_sales_silver_coins", "2800");
    this.update(dto);
    dto = new CreateConfigurationDto("fee_sales_silver_bars", "300");
    this.update(dto);
    dto = new CreateConfigurationDto("fee_year_silver_store_manage", "40");
    this.update(dto);
  }

  setDefaultFees(fees: any) {
    const feesList = Object.keys(fees).map(
      (key) => new CreateConfigurationDto(key, fees[key])
    );

    for (const fee of feesList) {
      this.update(fee);
    }
  }

  async getEmailFooter(advisor_id: string) {
    const conf = await this.mRepository.findOne({ key: "email_footer_" + advisor_id });
    if (conf) {
      return conf.value;
    }
    else {
      return '';
    }
  }

  updateEmailFooter(advisor_id: string, content: string) {
    return this.update(new CreateConfigurationDto("email_footer_" + advisor_id, content));
  }

  async create(dto: CreateConfigurationDto) {
    const configuration = new Configuration(dto);
    return await this.mRepository.save(configuration);
  }

  async getConfigurations(user: any) : Promise<any> {
    const confList = await this.mRepository.find();
    const result = {};
    for (const conf of confList) {
      if (conf.key.includes('email_footer')) {
        if (user.role == Role.Admin) {
          result[conf.key] = conf.value;
        }
        else {
          if (conf.key == 'email_footer_' + user.id) {
            result['email_footer'] = conf.value;
          }
        }
      }
      else {
        result[conf.key] = conf.value;
      }
    }
    return result;
  }

  async findOne(id: number) {
    return await this.mRepository.findOne(id);
  }

  async update(dto: UpdateConfigurationDto) {
    const configuration = await this.mRepository.findOne({ key: dto.key });
    if (configuration) {
      configuration.update(dto);
      return await this.mRepository.save(configuration);
    }
    else {
      return await this.create(new CreateConfigurationDto(dto.key, dto.value));
    }
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
