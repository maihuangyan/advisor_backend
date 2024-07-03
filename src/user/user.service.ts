import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { validate } from "class-validator";
import { Role } from "src/guards/enum/role.enum";
import { MAIL_DOMAIN, urls } from "src/utils/config_local";
import { m_constants } from "src/utils/const";
import { WorkTimeService } from "src/work-time/work-time.service";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";
import { Brackets, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ClientService } from "src/client/client.service";

@Injectable()
export class UserService extends BaseService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User)
    private mRepository: Repository<User>,
    private readonly zoomService: ZoomService,
    private readonly clientService: ClientService,
    private readonly workTimeService: WorkTimeService
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const qb = this.mRepository
      .createQueryBuilder()
      .where("username = :username", { username })
      .orWhere("email = :email", { email });

    const user = await qb.getOne();
    this.consoleLog("user", user);
    if (user) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailAlreadyTaken,
      };
    }

    if (password.length < 8) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidPasswordLength,
      };
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.brief = "";
    this.consoleLog("newUser", newUser);

    const errors = await validate(newUser);
    this.consoleLog("errors", errors);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    else {
      newUser.vmail = `${newUser.email.split("@")[0]}@${MAIL_DOMAIN}`;
      return this.addUserFields(await this.mRepository.save(newUser));
    }
  }

  async add(data: any) {
    const { username, email } = data;
    let qb = this.mRepository
      .createQueryBuilder()
      .where("email = :email", { email });

    let user = await qb.getOne();
    this.consoleLog("user", user);
    if (user) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailAlreadyTaken,
      };
    }

    qb = this.mRepository
      .createQueryBuilder()
      .where("username = :username", { username });

    user = await qb.getOne();
    this.consoleLog("user", user);
    if (user) {
      return {
        error:
          m_constants.RESPONSE_API_ERROR.resCodeInvalidUsernameAlreadyTaken,
      };
    }

    if (data.password.length < 8) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidPasswordLength,
      };
    }

    const client = await this.clientService.loadAndRegister(email);
    this.consoleLog(client);
    if (client.error) {
      if (client.responseCode == 2) {
        return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailWithNexoroneAccount }
      }
      else {
        return { error: client.responseCode, message: client.message }
      }
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await bcrypt.hash(data.password, 10);
    newUser.first_name = data.first_name;
    newUser.last_name = data.last_name;
    newUser.phone = data.phone;
    newUser.role = data.role;
    newUser.status = data.status;
    newUser.brief = "";

    const errors = await validate(newUser);
    this.consoleLog("errors", errors);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }
    else {
      // const zoomAccountID = await this.zoomService.registerZoomUser(newUser);
      // if (zoomAccountID.error) {
      //   return zoomAccountID;
      // }
      // else {
      //   newUser.zoom_account_id = zoomAccountID;
        //this.consoleLog(newUser);
        newUser.vmail = `${newUser.email.split("@")[0]}@${MAIL_DOMAIN}`;
        return this.addUserFields(await this.mRepository.save(newUser));
      //}
    }
  }

  async findAdvisor(id: number): Promise<User | any> {
    const user = await this.findOne(id);
    if (!user) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
    }
    return this.addUserFields(user);
  }

  async findOne(id: number): Promise<User | null> {
    return await this.mRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.mRepository.findOne({ email });
  }

  async findByForgotPasswordCode(code: string): Promise<User | undefined> {
    return await this.mRepository.findOne({ forgot_password_code: code });
  }

  async findAll() {
    const users = await this.mRepository.find({ role: Role.Advisor });
    const result = [];
    users.forEach((user) => {
      result.push(this.addUserFields(user));
    });
    return result;
  }

  async find(
    page: number,
    limit: number,
    role: Role,
    status: string,
    search_key: string
  ) {
    const offset = (page - 1) * limit;
    const qb = this.mRepository.createQueryBuilder().where(
      new Brackets((qb) => {
        qb.where(
          "username like :search_key or first_name like :search_key or last_name like :search_key or email like :search_key or phone like :search_key",
          { search_key: `%${search_key}%` }
        );
      })
    );

    if (role) {
      qb.andWhere("role = :role", { role });
    }
    if (status) {
      const nStatus = status == "pending" ? -1 : status == "active" ? 1 : status == "inactive" ? 0 : 2;
      qb.andWhere("status = :status", { status: nStatus });
    }
    // qb.limit(limit)
    // .offset(offset)

    let users = await qb.getMany();
    const total = users.length;
    // let total = await this.mRepository.count()
    // if (role) {
    //   const options: FindCondition<User> = {
    //     role
    //   }
    //   total = await this.mRepository.count(options)
    // };

    users = users.slice(offset, offset + limit);
    const result = [];
    users.forEach((user) => {
      result.push(this.addUserFields(user));
    });
    return { total, users: result };
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.mRepository.findOne(id);
    if (!user) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidID };
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

    if (
      dto.start_time1 !== undefined &&
      dto.end_time1 !== undefined &&
      dto.start_time2 !== undefined &&
      dto.end_time2 !== undefined
    ) {
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

    user.vmail = `${user.email.split("@")[0]}@${MAIL_DOMAIN}`;
    await this.mRepository.save(user);
    const updated = await this.mRepository.findOne(id);
    return this.addUserFields(updated);
  }

  async remove(id: number): Promise<any> {
    return await this.mRepository.delete(id);
  }

  addUserFields(user: any) {
    delete user.password;
    if (user.photo) {
      return {
        ...user,
        fullName: user.first_name + " " + user.last_name,
        avatar: urls.BASE_URL + urls.PROFILE_PHOTO_URL + user.photo,
        avatar_url: urls.BASE_URL + urls.PROFILE_PHOTO_URL + user.photo,
        file_url: urls.BASE_URL + urls.PROFILE_PHOTO_URL + user.photo,
      };
    }
    else {
      return {
        ...user,
        fullName: user.first_name + " " + user.last_name,
        avatar: "",
        avatar_url: "",
        file_url: "",
      };
    }
  }

  async getAdvisorDisplayCurrency(user_id: number) {
    const user = await this.findOne(user_id);
    if (user.currency) {
      return user.currency;
    }
    return 'EUR'
  }
}
