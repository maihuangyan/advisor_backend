"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexeroneService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const config_local_1 = require("../utils/config_local");
const const_1 = require("../utils/const");
const base_service_1 = require("../_base/base.service");
let NexeroneService = class NexeroneService extends base_service_1.BaseService {
    async getNexoroneToken() {
        return config_local_1.NEXORONE_TOKEN;
    }
    async verifyToken(token) {
        if (token == config_local_1.NEXORONE_TOKEN) {
            return true;
        }
        return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }
    async verifyClient(token) {
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getProfile",
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: token,
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                this.consoleError(response.data);
                return {
                    error: response.data.ResponseCode,
                    message: response.data.ResponseMessage,
                };
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async verifyClientToken(token) {
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/checkAccessToken",
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: token,
                },
            });
            if (response.data.ResponseCode == 0) {
                return true;
            }
            else {
                this.consoleError(response.data);
                return {
                    error: response.data.ResponseCode,
                    message: response.data.ResponseMessage,
                };
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientInfo(email) {
        const params = new URLSearchParams();
        params.append("Username", email);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getProfile",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientInfo(email);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        responseCode: response.data.ResponseCode,
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientBalancesWithProfitLoss(email) {
        const params = new URLSearchParams();
        params.append("username", email);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "getBalancesWithProfitLoss",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientBalancesWithProfitLoss(email);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async updateClientFees(email, data) {
        const params = new URLSearchParams();
        params.append("Username", email);
        params.append("TypeRegister", "5");
        params.append("FeePriceAuFactor", data.fee_bps_gold_coin);
        params.append("FeePriceAgFactor", data.fee_bps_silver_coin);
        params.append("FeeYearlyFee", data.fee_bps_gold_bar);
        params.append("FeeOtherFee", data.fee_bps_silver_bar);
        params.append("FeeStorageAgFactor", data.fee_bps_gold_storage);
        params.append("FeeStorageAuFactor", data.fee_bps_silver_storage);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/updateProfileExt",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            this.consoleLog(response.data);
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.updateClientFees(email, data);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async sendPushNotification(user, title, message) {
        const params = new URLSearchParams();
        params.append("Username", user);
        params.append("Title", title);
        params.append("Content", message);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL +
                    "onesignal/zoom/advisorMessagingPushNotification",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            this.consoleLog(response.data);
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    this.sendPushNotification(user, title, message);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientsWithProfileAndBalances(emailList) {
        if (emailList.length == 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const emails = emailList.join();
        const params = new URLSearchParams();
        params.append("UsernameList", emails);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getBalances",
                timeout: 300000,
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientsWithProfileAndBalances(emailList);
                }
                else {
                    this.consoleError(response.data.ResponseCode);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientsProfiles(emailList) {
        if (emailList.length == 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const emails = emailList.join();
        const params = new URLSearchParams();
        params.append("UsernameList", emails);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getProfiles",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientsProfiles(emailList);
                }
                else {
                    this.consoleError(response.data.ResponseCode);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientsBalances(emailList) {
        if (emailList.length == 0) {
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeInvalidData };
        }
        const emails = emailList.join();
        const params = new URLSearchParams();
        params.append("UsernameList", emails);
        this.consoleLog(params);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getBalances",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientsBalances(emailList);
                }
                else {
                    this.consoleError(response.data.ResponseCode);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientBalances(email) {
        const params = new URLSearchParams();
        params.append("username", email);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "getBalance",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientBalances(email);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientTransactions(account_number, start, end) {
        const params = new URLSearchParams();
        params.append("AccountNumber", account_number);
        params.append("Start", "" + start);
        params.append("End", "" + end);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "nexerone/getTransactions",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientTransactions(account_number, start, end);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadClientCardTransactions(card_number, card_currency, year, month) {
        const params = new URLSearchParams();
        params.append("cardnumber", card_number);
        params.append("month", month);
        params.append("year", year);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "intercash/getCardTransactionHistory",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                    AccessToken: await this.getNexoroneToken(),
                    "X-Currency": card_currency,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                if (response.data.ResponseCode == 2000) {
                    return await this.loadClientCardTransactions(card_number, card_currency, year, month);
                }
                else {
                    this.consoleError(response.data);
                    return {
                        error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                        message: response.data.ResponseMessage,
                    };
                }
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async loadCurrencyRates() {
        try {
            const response = await axios_1.default({
                method: "get",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "exchange_price/type_based_v7",
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                    message: response.data.ResponseMessage,
                };
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
    async sendEmail(email, subject, content) {
        const params = new URLSearchParams();
        params.append("email", email);
        params.append("subject", subject);
        params.append("content", content);
        try {
            const response = await axios_1.default({
                method: "post",
                url: config_local_1.urls.GS_MAIN_API_BASE_URL + "notifications/sendHtmlEmail",
                data: params,
                headers: {
                    AuthenticationToken: config_local_1.urls.GS_MAIN_API_AUTH,
                },
            });
            if (response.data.ResponseCode == 0) {
                return response.data.ResponseResult;
            }
            else {
                return {
                    error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
                    message: response.data.ResponseMessage,
                };
            }
        }
        catch (error) {
            this.consoleError(error);
            return { error: const_1.m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
        }
    }
};
NexeroneService = __decorate([
    common_1.Injectable()
], NexeroneService);
exports.NexeroneService = NexeroneService;
//# sourceMappingURL=nexerone.service.js.map