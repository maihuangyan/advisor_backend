import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { Email } from "./entities/email.entity";
import { Forwardings } from "./entities/forwardings.entity1";
export declare class CronJobService extends BaseService {
    private emailRepository;
    private vmailRepository;
    private isFetching;
    constructor(emailRepository: Repository<Email>, vmailRepository: Repository<Forwardings>);
    fetchInbox(): Promise<any>;
}
