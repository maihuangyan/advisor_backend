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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const config_local_1 = require("../utils/config_local");
const jwt = __importStar(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const user_entity_1 = require("../user/entities/user.entity");
const const_1 = require("../utils/const");
const update_user_dto_1 = require("../user/dto/update-user.dto");
const base_service_1 = require("../_base/base.service");
let ZoomService = class ZoomService extends base_service_1.BaseService {
    constructor() {
        super();
    }
    generateZoomAuthToken() {
        const payload = {
            iss: config_local_1.zoomConfig.Live.APIKey,
            exp: new Date().getTime() + 5000,
        };
        return jwt.sign(payload, config_local_1.zoomConfig.Live.APISecret);
    }
    generateJWT() {
        const now = new Date().getTime() / 1000;
        const payload = {
            appKey: config_local_1.zoomConfig.Live.AppKey,
            iat: now,
            exp: now + 86400 * 2,
            tokenExp: now + 86400,
        };
        return jwt.sign(payload, config_local_1.zoomConfig.Live.AppSecret);
    }
    async createMeeting(advisor, time) {
        const zoomAuthToken = this.generateZoomAuthToken();
        const params = {
            topic: "Advisor Meeting",
            type: 2,
            start_time: time.toISOString(),
            duration: 30,
            timezone: "UTC",
            password: "ZoomPass1@",
        };
        try {
            const response = await axios_1.default({
                method: "post",
                url: `https://api.zoom.us/v2/users/${advisor.email}/meetings`,
                data: params,
                headers: {
                    Authorization: `Bearer ${zoomAuthToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.code &&
                response.data.message &&
                response.data.code > 0) {
                this.consoleLog(response.data);
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                    message: response.data.message,
                };
            }
            return response.data;
        }
        catch (err) {
            this.consoleError(err);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError };
        }
    }
    async deleteMeeting(meetingId) {
        const zoomAuthToken = this.generateZoomAuthToken();
        try {
            const response = await axios_1.default({
                method: "delete",
                url: `https://api.zoom.us/v2/meetings/${meetingId}`,
                headers: {
                    Authorization: `Bearer ${zoomAuthToken}`,
                },
            });
            if (response.data.code &&
                response.data.message &&
                response.data.code > 0) {
                this.consoleLog(response.data);
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                    message: response.data.message,
                };
            }
            return response.data;
        }
        catch (err) {
            this.consoleError(err);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError };
        }
    }
    async loadAdvisorMeetings(advisor) {
        const zoomAuthToken = this.generateZoomAuthToken();
        try {
            const response = await axios_1.default({
                method: "get",
                url: `https://api.zoom.us/v2/users/${advisor.email}/meetings?type=upcoming`,
                headers: {
                    Authorization: `Bearer ${zoomAuthToken}`,
                },
            });
            if (response.data.code &&
                response.data.message &&
                response.data.code > 0) {
                this.consoleLog(response.data);
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                    message: response.data.message,
                };
            }
            return response.data;
        }
        catch (err) {
            this.consoleError(err);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError };
        }
    }
    async loadZoomUsers() {
        const zoomAuthToken = this.generateZoomAuthToken();
        try {
            const response = await axios_1.default({
                method: "get",
                url: `https://api.zoom.us/v2/users`,
                headers: {
                    Authorization: `Bearer ${zoomAuthToken}`,
                },
            });
            if (response.data.code &&
                response.data.message &&
                response.data.code > 0) {
                this.consoleLog(response.data);
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                    message: response.data.message,
                };
            }
            return response.data;
        }
        catch (err) {
            this.consoleError(err);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError };
        }
    }
    async registerZoomUser(advisor) {
        const usersData = await this.loadZoomUsers();
        for (const zoomUser of usersData.users) {
            if (zoomUser.email.toLowerCase() == advisor.email.toLowerCase()) {
                return zoomUser.id;
            }
        }
        const zoomAuthToken = this.generateZoomAuthToken();
        const param = {
            action: "create",
            user_info: {
                email: advisor.email,
                type: 1,
                first_name: advisor.first_name,
                last_name: advisor.last_name,
            },
        };
        try {
            const response = await axios_1.default({
                method: "post",
                url: `https://api.zoom.us/v2/users`,
                data: param,
                headers: {
                    Authorization: `Bearer ${zoomAuthToken}`,
                },
            });
            if (response.data.code &&
                response.data.message &&
                response.data.code > 0) {
                this.consoleLog(response.data);
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                    message: response.data.message,
                };
            }
            const zoomAccountID = response.data.id;
            return zoomAccountID;
        }
        catch (err) {
            if (err.response) {
                this.consoleError(err.response);
                const resData = err.response.data;
                if (resData) {
                    if (resData.code && resData.message && resData.code > 0) {
                        this.consoleLog(resData);
                        return {
                            error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError,
                            message: resData.message,
                        };
                    }
                }
            }
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeZoomApiError };
        }
    }
};
ZoomService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], ZoomService);
exports.ZoomService = ZoomService;
//# sourceMappingURL=zoom.service.js.map