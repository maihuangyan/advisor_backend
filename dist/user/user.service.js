"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const class_validator_1 = require("class-validator");
const role_enum_1 = require("../guards/enum/role.enum");
const config_local_1 = require("../utils/config_local");
const const_1 = require("../utils/const");
const work_time_service_1 = require("../work-time/work-time.service");
const zoom_service_1 = require("../zoom/zoom.service");
const base_service_1 = require("../_base/base.service");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const client_service_1 = require("../client/client.service");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(mRepository, zoomService, clientService, workTimeService) {
        super();
        this.mRepository = mRepository;
        this.zoomService = zoomService;
        this.clientService = clientService;
        this.workTimeService = workTimeService;
    }
    async create(createUserDto) {
        const { username, email, password } = createUserDto;
        const qb = this.mRepository
            .createQueryBuilder()
            .where("username = :username", { username })
            .orWhere("email = :email", { email });
        const user = await qb.getOne();
        this.consoleLog("user", user);
        if (user) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailAlreadyTaken,
            };
        }
        if (password.length < 8) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidPasswordLength,
            };
        }
        const newUser = new user_entity_1.User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        newUser.brief = "";
        this.consoleLog("newUser", newUser);
        const errors = await class_validator_1.validate(newUser);
        this.consoleLog("errors", errors);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        else {
            newUser.vmail = `${newUser.email.split("@")[0]}@${config_local_1.MAIL_DOMAIN}`;
            return this.addUserFields(await this.mRepository.save(newUser));
        }
    }
    async add(data) {
        const { username, email } = data;
        let qb = this.mRepository
            .createQueryBuilder()
            .where("email = :email", { email });
        let user = await qb.getOne();
        this.consoleLog("user", user);
        if (user) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailAlreadyTaken,
            };
        }
        qb = this.mRepository
            .createQueryBuilder()
            .where("username = :username", { username });
        user = await qb.getOne();
        this.consoleLog("user", user);
        if (user) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidUsernameAlreadyTaken,
            };
        }
        if (data.password.length < 8) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidPasswordLength,
            };
        }
        const client = await this.clientService.loadAndRegister(email);
        this.consoleLog(client);
        if (client.error) {
            if (client.responseCode == 2) {
                return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailWithNexoroneAccount };
            }
            else {
                return { error: client.responseCode, message: client.message };
            }
        }
        const newUser = new user_entity_1.User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = await bcrypt.hash(data.password, 10);
        newUser.first_name = data.first_name;
        newUser.last_name = data.last_name;
        newUser.phone = data.phone;
        newUser.role = data.role;
        newUser.status = data.status;
        newUser.brief = "";
        const errors = await class_validator_1.validate(newUser);
        this.consoleLog("errors", errors);
        if (errors.length > 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        else {
            newUser.vmail = `${newUser.email.split("@")[0]}@${config_local_1.MAIL_DOMAIN}`;
            return this.addUserFields(await this.mRepository.save(newUser));
        }
    }
    async findAdvisor(id) {
        const user = await this.findOne(id);
        if (!user) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
        }
        return this.addUserFields(user);
    }
    async findOne(id) {
        return await this.mRepository.findOne(id);
    }
    async findByEmail(email) {
        return await this.mRepository.findOne({ email });
    }
    async findByForgotPasswordCode(code) {
        return await this.mRepository.findOne({ forgot_password_code: code });
    }
    async findAll() {
        const users = await this.mRepository.find({ role: role_enum_1.Role.Advisor });
        const result = [];
        users.forEach((user) => {
            result.push(this.addUserFields(user));
        });
        return result;
    }
    async find(page, limit, role, status, search_key) {
        const offset = (page - 1) * limit;
        const qb = this.mRepository.createQueryBuilder().where(new typeorm_2.Brackets((qb) => {
            qb.where("username like :search_key or first_name like :search_key or last_name like :search_key or email like :search_key or phone like :search_key", { search_key: `%${search_key}%` });
        }));
        if (role) {
            qb.andWhere("role = :role", { role });
        }
        if (status) {
            const nStatus = status == "pending" ? -1 : status == "active" ? 1 : status == "inactive" ? 0 : 2;
            qb.andWhere("status = :status", { status: nStatus });
        }
        let users = await qb.getMany();
        const total = users.length;
        users = users.slice(offset, offset + limit);
        const result = [];
        users.forEach((user) => {
            result.push(this.addUserFields(user));
        });
        return { total, users: result };
    }
    async update(id, dto) {
        const user = await this.mRepository.findOne(id);
        if (!user) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidID };
        }
        user.username = dto.username ? dto.username : user.username;
        user.email = dto.email ? dto.email : user.email;
        user.password = dto.password ? dto.password : user.password;
        user.phone = dto.phone ? dto.phone : user.phone;
        user.timezone = dto.timezone ? dto.timezone : user.timezone;
        user.first_name = dto.first_name ? dto.first_name : user.first_name;
        user.last_name = dto.last_name ? dto.last_name : user.last_name;
        user.photo = dto.photo ? dto.photo : user.photo;
        user.currency = dto.currency ? dto.currency : user.currency;
        user.role = dto.role ? dto.role : user.role;
        (user.verified_email = dto.verified_email
            ? dto.verified_email
            : user.verified_email),
            (user.verified_phone = dto.verified_phone
                ? dto.verified_phone
                : user.verified_phone),
            (user.status = dto.status != null ? dto.status : user.status);
        user.company = dto.company ? dto.company : user.company;
        user.zoom_account_id = dto.zoom_account_id
            ? dto.zoom_account_id
            : user.zoom_account_id;
        user.brief = dto.brief ? dto.brief : user.brief;
        user.date_of_birth = dto.date_of_birth
            ? dto.date_of_birth
            : user.date_of_birth;
        user.gender = dto.gender ? dto.gender : user.gender;
        user.forgot_password_code = dto.forgot_password_code
            ? dto.forgot_password_code
            : user.forgot_password_code;
        if (dto.start_time1 !== undefined &&
            dto.end_time1 !== undefined &&
            dto.start_time2 !== undefined &&
            dto.end_time2 !== undefined) {
            const data = {
                user_id: id,
                start1: dto.start_time1,
                end1: dto.end_time1,
                start2: dto.start_time2,
                end2: dto.end_time2,
            };
            const result = await this.workTimeService.setWorkTimes(data);
            if (result.error) {
                return result;
            }
        }
        if (dto.status == 1 && !user.zoom_account_id) {
            const zoomAccountID = await this.zoomService.registerZoomUser(user);
            if (zoomAccountID.error) {
                return zoomAccountID;
            }
            else {
                user.zoom_account_id = zoomAccountID;
            }
        }
        user.vmail = `${user.email.split("@")[0]}@${config_local_1.MAIL_DOMAIN}`;
        await this.mRepository.save(user);
        const updated = await this.mRepository.findOne(id);
        return this.addUserFields(updated);
    }
    async remove(id) {
        return await this.mRepository.delete(id);
    }
    addUserFields(user) {
        delete user.password;
        if (user.photo) {
            return Object.assign(Object.assign({}, user), { fullName: user.first_name + " " + user.last_name, avatar: config_local_1.urls.BASE_URL + config_local_1.urls.PROFILE_PHOTO_URL + user.photo, avatar_url: config_local_1.urls.BASE_URL + config_local_1.urls.PROFILE_PHOTO_URL + user.photo, file_url: config_local_1.urls.BASE_URL + config_local_1.urls.PROFILE_PHOTO_URL + user.photo });
        }
        else {
            return Object.assign(Object.assign({}, user), { fullName: user.first_name + " " + user.last_name, avatar: "", avatar_url: "", file_url: "" });
        }
    }
    async getAdvisorDisplayCurrency(user_id) {
        const user = await this.findOne(user_id);
        if (user.currency) {
            return user.currency;
        }
        return 'EUR';
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        zoom_service_1.ZoomService,
        client_service_1.ClientService,
        work_time_service_1.WorkTimeService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map