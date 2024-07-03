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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const const_1 = require("../utils/const");
const update_user_dto_1 = require("../user/dto/update-user.dto");
const base_service_1 = require("../_base/base.service");
const nexerone_service_1 = require("../nexerone/nexerone.service");
const utils_1 = require("../utils/utils");
const role_enum_1 = require("../guards/enum/role.enum");
const config_local_1 = require("../utils/config_local");
const client_service_1 = require("../client/client.service");
let AuthService = class AuthService extends base_service_1.BaseService {
    constructor(userService, jwtService, nexeroneService, clientService) {
        super();
        this.userService = userService;
        this.jwtService = jwtService;
        this.nexeroneService = nexeroneService;
        this.clientService = clientService;
        this.saltOrRounds = 10;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmail };
        }
        if (user.status == -1) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodePendingUser };
        }
        else if (user.status == 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInactiveUser };
        }
        if (user.role == role_enum_1.Role.Advisor) {
            const clientInfoOfAdvisor = await this.nexeroneService.loadClientInfo(user.email);
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
            const _a = this.userService.addUserFields(user), { password } = _a, result = __rest(_a, ["password"]);
            return result;
        }
        return {
            error: const_1.m_constants.RESPONSE_API_ERROR.resCodeLoginInvalidPassword,
        };
    }
    login(user) {
        if (user.error) {
            return user;
        }
        else {
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
    async register(user) {
        const password = user.password;
        const client = await this.clientService.loadAndRegister(user.email);
        if (client.responseCode != 0) {
            if (client.responseCode == 2) {
                return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailWithNexoroneAccount };
            }
            return client;
        }
        const hash = await bcrypt.hash(password, this.saltOrRounds);
        user.password = hash;
        return await this.userService.create(user);
    }
    async resetPassword(userId, passwords) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            return { error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidID };
        }
        let isValid = await bcrypt.compare(passwords.new_password, user.password);
        if (isValid) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeResetPasswordUsedSamePassword,
            };
        }
        isValid = await bcrypt.compare(passwords.old_password, user.password);
        if (user && isValid) {
            const dto = new update_user_dto_1.UpdateUserDto();
            dto.password = await bcrypt.hash(passwords.new_password, this.saltOrRounds);
            return await this.userService.update(userId, dto);
        }
        return {
            error: const_1.m_constants.RESPONSE_API_ERROR.resCodeLoginInvalidPassword,
        };
    }
    async verifyToken(token) {
        try {
            const payload = await this.jwtService.verify(token);
            if (payload) {
                if (payload.user.role == role_enum_1.Role.Advisor) {
                    const user = await this.userService.findOne(payload.user.id);
                    if (!user || user.status !== 1) {
                        return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
                    }
                }
                return payload;
            }
            else {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
            }
        }
        catch (error) {
            if (error.name && error.name == "TokenExpiredError") {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeTokenExpired };
            }
            else {
                return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
            }
        }
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeInvalidEmail,
                message: "We couldn't find the user associated to the email address. Enter valid email address please",
            };
        }
        const forgotPasswordCode = utils_1.randomString(50);
        const updateDto = new update_user_dto_1.UpdateUserDto();
        updateDto.forgot_password_code = forgotPasswordCode;
        this.userService.update(user.id, updateDto);
        const emailContent = "<html><body>" +
            "<h1>GoldenSuisse</h1>" +
            '<p>Please use <a href="' + config_local_1.FRONTEND_URL + '/reset-password/' +
            forgotPasswordCode +
            '">this link</a> to reset your password.</p>' +
            "</body></html>";
        return await this.nexeroneService.sendEmail(email, "Reset Password", emailContent);
    }
    async resetForgotPassword(params) {
        if (!params.code) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidCode,
            };
        }
        if (!params.password || params.password.length < 8) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidPassword,
            };
        }
        const user = await this.userService.findByForgotPasswordCode(params.code);
        if (!user) {
            return {
                error: const_1.m_constants.RESPONSE_API_ERROR.resCodeResetPasswordInvalidCode,
            };
        }
        const dto = new update_user_dto_1.UpdateUserDto();
        dto.password = await bcrypt.hash(params.password, this.saltOrRounds);
        dto.forgot_password_code = "reset";
        return await this.userService.update(user.id, dto);
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        nexerone_service_1.NexeroneService,
        client_service_1.ClientService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map