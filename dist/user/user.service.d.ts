import { Role } from "src/guards/enum/role.enum";
import { WorkTimeService } from "src/work-time/work-time.service";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ClientService } from "src/client/client.service";
export declare class UserService extends BaseService {
    private mRepository;
    private readonly zoomService;
    private readonly clientService;
    private readonly workTimeService;
    private readonly users;
    constructor(mRepository: Repository<User>, zoomService: ZoomService, clientService: ClientService, workTimeService: WorkTimeService);
    create(createUserDto: CreateUserDto): Promise<any>;
    add(data: any): Promise<any>;
    findAdvisor(id: number): Promise<User | any>;
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | undefined>;
    findByForgotPasswordCode(code: string): Promise<User | undefined>;
    findAll(): Promise<any[]>;
    find(page: number, limit: number, role: Role, status: string, search_key: string): Promise<{
        total: number;
        users: any[];
    }>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<any>;
    addUserFields(user: any): any;
    getAdvisorDisplayCurrency(user_id: number): Promise<string>;
}
