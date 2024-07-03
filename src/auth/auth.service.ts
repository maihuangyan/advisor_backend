import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { m_constants } from "src/utils/const";
import { UpdateUserDto } from "src/user/dto/update-user.dto";
import { BaseService } from "src/_base/base.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { randomString } from "src/utils/utils";
import { Role } from "src/guards/enum/role.enum";
import { FRONTEND_URL } from "src/utils/config_local";
import { ClientService } from "src/client/client.service";

@Injectable()
export class AuthService extends BaseService {
  private saltOrRounds = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly nexeroneService: NexeroneService,
    private readonly clientService: ClientService
  ) {
    super();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmail };
    }
    if (user.status == -1) {
      return { error: m_constants.RESPONSE_ERROR.resCodePendingUser };
    }
    else if (user.status == 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInactiveUser };
    }

    if (user.role == Role.Advisor) {
      const clientInfoOfAdvisor = await this.nexeroneService.loadClientInfo(
        user.email
      );
      if (!clientInfoOfAdvisor.error) {
        this.clientService.register(clientInfoOfAdvisor);
        user.customer_id = clientInfoOfAdvisor.CustomerID;
        user.registered_at = clientInfoOfAdvisor.CreatedAt;
        user.city = clientInfoOfAdvisor.PhysicalAddressCity;
        user.country = clientInfoOfAdvisor.PhysicalAddressCountry;
        user.client_status = clientInfoOfAdvisor.ProfileStatus;
      }
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (user && isValid) {
      const { password, ...result } = this.userService.addUserFields(user);
      return result;
    }
    return {
      error: m_constants.RESPONSE_API_ERROR.resCodeLoginInvalidPassword,
    };
  }

  login(user: any) {
    if (user.error) {
      return user;
    } else {
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          vmail: user.vmail,
          role: user.role,
        },
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    }
  }

  async register(user: any) {
    const password = user.password;

    const client = await this.clientService.loadAndRegister(user.email);
    if (client.responseCode != 0) {
      if (client.responseCode == 2) {
        return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailWithNexoroneAccount }
      }
      return client;
    }

    const hash = await bcrypt.hash(password, this.saltOrRounds);
    user.password = hash;
    return await this.userService.create(user);
  }

  async resetPassword(userId: number, passwords: any) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidID };
    }
    let isValid = await bcrypt.compare(passwords.new_password, user.password);
    if (isValid) {
      return {
        error:
          m_constants.RESPONSE_API_ERROR.resCodeResetPasswordUsedSamePassword,
      };
    }

    isValid = await bcrypt.compare(passwords.old_password, user.password);
    if (user && isValid) {
      const dto = new UpdateUserDto();
      dto.password = await bcrypt.hash(
        passwords.new_password,
        this.saltOrRounds
      );
      return await this.userService.update(userId, dto);
    }
    return {
      error: m_constants.RESPONSE_API_ERROR.resCodeLoginInvalidPassword,
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      if (payload) {
        if (payload.user.role == Role.Advisor) {
          const user = await this.userService.findOne(payload.user.id);
          if (!user || user.status !== 1) {
            return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
          }
        }
        return payload;
      }
      else {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
      }
    } catch (error) {
      if (error.name && error.name == "TokenExpiredError") {
        return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
      } else {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
      }
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmail,
        message:
          "We couldn't find the user associated to the email address. Enter valid email address please",
      };
    }

    const forgotPasswordCode = randomString(50);

    const updateDto = new UpdateUserDto();
    updateDto.forgot_password_code = forgotPasswordCode;
    this.userService.update(user.id, updateDto);

    const emailContent =
      "<html><body>" +
      "<h1>GoldenSuisse</h1>" +
      '<p>Please use <a href="' + FRONTEND_URL + '/reset-password/' +
      forgotPasswordCode +
      '">this link</a> to reset your password.</p>' +
      "</body></html>";
    return await this.nexeroneService.sendEmail(
      email,
      "Reset Password",
      emailContent
    );
  }

  async resetForgotPassword(params: any) {
    if (!params.code) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidCode,
      };
    }
    if (!params.password || params.password.length < 8) {
      return {
        error:
          m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidPassword,
      };
    }

    const user = await this.userService.findByForgotPasswordCode(params.code);
    if (!user) {
      return {
        error: m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidCode,
      };
    }

    const dto = new UpdateUserDto();
    dto.password = await bcrypt.hash(params.password, this.saltOrRounds);
    dto.forgot_password_code = "reset";

    return await this.userService.update(user.id, dto);
  }
}
