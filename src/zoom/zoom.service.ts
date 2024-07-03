import { Injectable } from "@nestjs/common";
import { zoomConfig } from "src/utils/config_local";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "src/user/entities/user.entity";
import { m_constants } from "src/utils/const";
import { UpdateUserDto } from "src/user/dto/update-user.dto";
import { BaseService } from "src/_base/base.service";

@Injectable()
export class ZoomService extends BaseService {
  constructor() {
    super();
  }

  generateZoomAuthToken() {
    const payload = {
      iss: zoomConfig.Live.APIKey,
      exp: new Date().getTime() + 5000,
    };

    return jwt.sign(payload, zoomConfig.Live.APISecret);
  }

  generateJWT() {
    const now = new Date().getTime() / 1000;
    const payload = {
      appKey: zoomConfig.Live.AppKey,
      iat: now,
      exp: now + 86400 * 2,
      tokenExp: now + 86400,
    };

    return jwt.sign(payload, zoomConfig.Live.AppSecret);
  }

  async createMeeting(advisor: User, time: Date): Promise<any> {
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
      const response = await axios({
        method: "post",
        url: `https://api.zoom.us/v2/users/${advisor.email}/meetings`,
        data: params,
        headers: {
          Authorization: `Bearer ${zoomAuthToken}`,
          "Content-Type": "application/json",
        },
      });

      if (
        response.data.code &&
        response.data.message &&
        response.data.code > 0
      ) {
        this.consoleLog(response.data);
        return {
          error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
          message: response.data.message,
        };
      }

      return response.data;
    } catch (err) {
      this.consoleError(err);
      return { error: m_constants.RESPONSE_ERROR.resCodeZoomApiError };
    }
  }

  async deleteMeeting(meetingId: string) {
    const zoomAuthToken = this.generateZoomAuthToken();

    try {
      const response = await axios({
        method: "delete",
        url: `https://api.zoom.us/v2/meetings/${meetingId}`,
        headers: {
          Authorization: `Bearer ${zoomAuthToken}`,
        },
      });

      if (
        response.data.code &&
        response.data.message &&
        response.data.code > 0
      ) {
        this.consoleLog(response.data);
        return {
          error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
          message: response.data.message,
        };
      }

      return response.data;
    } catch (err) {
      this.consoleError(err);
      return { error: m_constants.RESPONSE_ERROR.resCodeZoomApiError };
    }
  }

  async loadAdvisorMeetings(advisor: User) {
    const zoomAuthToken = this.generateZoomAuthToken();
    try {
      const response = await axios({
        method: "get",
        url: `https://api.zoom.us/v2/users/${advisor.email}/meetings?type=upcoming`,
        headers: {
          Authorization: `Bearer ${zoomAuthToken}`,
        },
      });

      if (
        response.data.code &&
        response.data.message &&
        response.data.code > 0
      ) {
        this.consoleLog(response.data);
        return {
          error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
          message: response.data.message,
        };
      }

      return response.data;
    } catch (err) {
      this.consoleError(err);
      return { error: m_constants.RESPONSE_ERROR.resCodeZoomApiError };
    }
  }

  async loadZoomUsers(): Promise<any> {
    const zoomAuthToken = this.generateZoomAuthToken();
    try {
      const response = await axios({
        method: "get",
        url: `https://api.zoom.us/v2/users`,
        headers: {
          Authorization: `Bearer ${zoomAuthToken}`,
        },
      });

      if (
        response.data.code &&
        response.data.message &&
        response.data.code > 0
      ) {
        this.consoleLog(response.data);
        return {
          error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
          message: response.data.message,
        };
      }

      return response.data;
    } catch (err) {
      this.consoleError(err);
      return { error: m_constants.RESPONSE_ERROR.resCodeZoomApiError };
    }
  }

  async registerZoomUser(advisor: User) {
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
        //password: advisor.password
      },
    };
    try {
      const response = await axios({
        method: "post",
        url: `https://api.zoom.us/v2/users`,
        data: param,
        headers: {
          Authorization: `Bearer ${zoomAuthToken}`,
        },
      });

      if (
        response.data.code &&
        response.data.message &&
        response.data.code > 0
      ) {
        this.consoleLog(response.data);
        return {
          error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
          message: response.data.message,
        };
      }

      const zoomAccountID = response.data.id;
      return zoomAccountID;
    } catch (err) {
      if (err.response) {
        this.consoleError(err.response);
        const resData = err.response.data;
        if (resData) {
          if (resData.code && resData.message && resData.code > 0) {
            this.consoleLog(resData);
            return {
              error: m_constants.RESPONSE_ERROR.resCodeZoomApiError,
              message: resData.message,
            };
          }
        }
      }

      return { error: m_constants.RESPONSE_ERROR.resCodeZoomApiError };
    }
  }
}
