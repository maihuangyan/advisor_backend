/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { NEXORONE_TOKEN, urls } from "src/utils/config_local";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";

@Injectable()
export class NexeroneService extends BaseService {
  async getNexoroneToken(): Promise<string> {
    return NEXORONE_TOKEN;
  }

  async verifyToken(token: string): Promise<any> {
    if (token == NEXORONE_TOKEN) {
      return true;
    }
    return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
  }

  async verifyClient(token: string): Promise<any> {
    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/getProfile",
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async verifyClientToken(token: string): Promise<any> {
    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/checkAccessToken",
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientInfo(email: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("Username", email);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/getProfile",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    }
    catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientBalancesWithProfitLoss(email: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("username", email);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "getBalancesWithProfitLoss",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    }
    catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async updateClientFees(email: string, data: any): Promise<any> {
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
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/updateProfileExt",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async sendPushNotification(user: string, title: string, message: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("Username", user);
    params.append("Title", title);
    params.append("Content", message);

    try {
      const response = await axios({
        method: "post",
        url:
          urls.GS_MAIN_API_BASE_URL +
          "onesignal/zoom/advisorMessagingPushNotification",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientsWithProfileAndBalances(emailList: Array<string>): Promise<any> {
    if (emailList.length == 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const emails = emailList.join();
    const params = new URLSearchParams();
    params.append("UsernameList", emails);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/getBalances",
        timeout: 300000,
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    }
    catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientsProfiles(emailList: Array<string>): Promise<any> {
    if (emailList.length == 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const emails = emailList.join();
    const params = new URLSearchParams();
    params.append("UsernameList", emails);

    try {
      const response = await axios({
        method: "post",
        url:
          urls.GS_MAIN_API_BASE_URL + "nexerone/getProfiles",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    }
    catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientsBalances(emailList: Array<string>): Promise<any> {
    if (emailList.length == 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const emails = emailList.join();
    const params = new URLSearchParams();
    params.append("UsernameList", emails);
    this.consoleLog(params)

    try {
      const response = await axios({
        method: "post",
        url:
          urls.GS_MAIN_API_BASE_URL + "nexerone/getBalances",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    }
    catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientBalances(email: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("username", email);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "getBalance",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientTransactions(
    account_number: string,
    start: number,
    end: number
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append("AccountNumber", account_number);
    params.append("Start", "" + start);
    params.append("End", "" + end);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "nexerone/getTransactions",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadClientCardTransactions(
    card_number: string,
    card_currency: string,
    year: string,
    month: string
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append("cardnumber", card_number);
    params.append("month", month);
    params.append("year", year);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "intercash/getCardTransactionHistory",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
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
          return await this.loadClientCardTransactions(
            card_number,
            card_currency,
            year,
            month
          );
        }
        else {
          this.consoleError(response.data);
          return {
            error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
            message: response.data.ResponseMessage,
          };
        }
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async loadCurrencyRates(): Promise<any> {
    try {
      const response = await axios({
        method: "get",
        url: urls.GS_MAIN_API_BASE_URL + "exchange_price/type_based_v7",
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
        },
      });

      if (response.data.ResponseCode == 0) {
        return response.data.ResponseResult;
      }
      else {
        return {
          error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
          message: response.data.ResponseMessage,
        };
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

  async sendEmail(email: string, subject: string, content: string): Promise<any> {
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("subject", subject);
    params.append("content", content);

    try {
      const response = await axios({
        method: "post",
        url: urls.GS_MAIN_API_BASE_URL + "notifications/sendHtmlEmail",
        data: params,
        headers: {
          AuthenticationToken: urls.GS_MAIN_API_AUTH,
        },
      });

      if (response.data.ResponseCode == 0) {
        return response.data.ResponseResult;
      }
      else {
        return {
          error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError,
          message: response.data.ResponseMessage,
        };
      }
    } catch (error) {
      this.consoleError(error);
      return { error: m_constants.RESPONSE_ERROR.resCodeMainBackendApiError };
    }
  }

}
