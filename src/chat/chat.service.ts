import { Injectable } from "@nestjs/common";
import { OnlineService } from "src/online/online.service";
import { AuthService } from "src/auth/auth.service";
import { RoomService } from "src/room/room.service";
import { MessageService } from "src/message/message.service";
import { m_constants } from "src/utils/const";
import { CreateMessageDto } from "src/message/dto/create-message.dto";
import { isArray } from "class-validator";
import { Role } from "src/guards/enum/role.enum";
import { ConnectionService } from "src/connection/connection.service";
import { ClientService } from "src/client/client.service";
import { BaseService } from "src/_base/base.service";
import { Message } from "src/message/entities/message.entity";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService extends BaseService {
  constructor(
    private readonly authService: AuthService,
    private readonly onlineService: OnlineService,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly nexeroneService: NexeroneService
  ) {
    super();
  }

  async login(param: any, socket_id: string): Promise<any> {
    //this.consoleLog('ChatService:26 - ', param)
    if (!param.token) {
      this.consoleError(m_constants.RESPONSE_ERROR.resCodeNoToken);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const auth = await this.authService.verifyToken(param.token);
    if (auth.error) {
      return auth;
    }
    else {
      //this.consoleLog(auth.user);
      if (auth.user.role == Role.Advisor) {
        param.user_id = auth.user.id;

        const advisorRooms = await this.roomService.findAdvisorRooms(
          auth.user.id
        );
        const room_ids = [];
        advisorRooms.forEach((room) => {
          room_ids.push("" + room.id);
        });

        param.room_ids = room_ids;
      }
      else if (auth.user.role == Role.User) {
        const connection = await this.connectionService.findByClientEmail(
          auth.user.email
        );
        if (!connection) {
          return {
            error: m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketNoAdvisor,
          };
        }
        param.advisor_id = connection.advisor_id;
        param.user_id = auth.user.email;

        const room = await this.roomService.findByAdvisorAndClient(
          param.advisor_id,
          param.user_id
        );
        // if (!room) {
        //   const client = await this.clientService.findOne(auth.user.id);
        //   room = await this.roomService.create(new CreateRoomDto('' + param.advisor_id, '' + auth.user.email, client.getFullName(), client.photo))
        // }

        if (!room) {
          return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
          // this.consoleLog(m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketLoginCreateRoomFail);
          // return { error: m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketLoginCreateRoomFail };
        }
        else {
          param.socket_id = socket_id;
          param.room_id = "" + room.id;
        }

        const advisor = await this.userService.findOne(param.advisor_id);
        if (!advisor) {
          return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
        }
        if (advisor.status !== 1) {
          return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
      }

      return param;
    }
  }

  async typing(param: any, socket_id: string): Promise<any> {
    //this.consoleLog(param)
    if (!param.token) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const mUser = this.onlineService.getUserByToken(param.token);
    if (!mUser) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }

    if (!param.room_id) {
      this.consoleError(param);
      return {
        error: m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketTypingNoRoomID,
      };
    }

    const room = await this.roomService.findById(param.room_id);
    if (!room) {
      this.onlineService.removeRoom(param.room_id);
      return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
    }

    const advisor = await this.userService.findOne(room.advisor_id);
    if (!advisor) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
    }

    if (param.type != 0 && param.type != 1) {
      this.consoleError(param);
      return {
        error: m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketTypingNoType,
      };
    }

    param.user_id = mUser.user_id;
    return param;
  }

  async sendMessage(param: any, socket_id: string): Promise<any> {
    //this.consoleLog(param)
    if (!param.token) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const rooms = this.onlineService.getRoomIDsByUser(param.token);
    //this.consoleLog(rooms);
    if (rooms.length < 1) {
      // if length > 1 means it is advisor joined several rooms
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }

    if (!param.room_id) {
      this.consoleError(param);
      return {
        error:
          m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoRoomID,
      };
    }

    const room = await this.roomService.findById(param.room_id);
    if (!room) {
      this.onlineService.removeRoom(param.room_id);
      return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
    }

    const advisor = await this.userService.findOne(room.advisor_id);
    if (!advisor) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
    }

    if (!param.type) {
      this.consoleError(param);
      return {
        error: m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoType,
      };
    }

    if (!param.message) {
      this.consoleError(param);
      return {
        error:
          m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageNoMessage,
      };
    }

    const sender = this.onlineService.getUserByToken(param.token);
    if (!sender || !sender.user_id) {
      return {
        error:
          m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketSendMessageInvalidUser,
      };
    }

    const message = param.message.replace(/^\s*$(?:\r\n?|\n)/gm, "");
    const newMessage = new CreateMessageDto(
      param.room_id,
      sender.user_id,
      param.local_id,
      message,
      param.type
    );
    const uMessage = await this.messageService.create(newMessage);

    if (uMessage.error) {
      this.consoleError(param);
      return uMessage;
    } else {
      uMessage.seen_status = 0;
      if (("" + sender.user_id).includes("@")) {
        uMessage.client = this.clientService.addUserFields(
          await this.clientService.findOneByEmail(sender.user_id)
        );
      }
      //this.consoleLog('ChatService.js:167 - ', message);

      // currently send push only clients, so if sender is client, return
      if (sender.user_id && ("" + sender.user_id).includes("@")) {
        return uMessage;
      }

      const room = await this.roomService.findOne(+param.room_id);
      if (!room || !room.client_id) {
        return {
          error:
            m_constants.RESPONSE_SOCKET_ERROR
              .resCodeSocketSendMessageInvalidRoom,
        };
      }

      let pushUser: string = room.client_id; // client email
      const roomUsers = this.onlineService.getRoom(param.room_id);
      for (const roomUser of roomUsers.users) {
        if (pushUser == roomUser.user_id) {
          pushUser = null;
          break;
        }
      }
      this.sendPushNotification(pushUser, uMessage);

      return uMessage;
    }
  }

  sendPushNotification(clientEmail: string, message: Message) {
    if (clientEmail && message && message.message) {
      this.nexeroneService.sendPushNotification(
        clientEmail,
        `Your advisor sent a new message`,
        message.message
      );
    }
  }

  async openMessage(param: any, socket_id: string): Promise<any> {
    if (!param.token) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const rooms = this.onlineService.getRoomIDsByUser(param.token);
    if (rooms.length < 1) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }

    if (
      !param.message_ids ||
      !isArray(param.message_ids) ||
      param.message_ids.length < 1
    ) {
      this.consoleError(param);
      return {
        error:
          m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketOpenMessageNoMessageID,
      };
    }

    const updatedMessages = [];
    //this.consoleLog(param);
    for (const messageID of param.message_ids) {
      if (messageID) {
        try {
          const message = await this.messageService.addSeen(messageID);
          if (message) {
            updatedMessages.push(message);
          } else {
            this.consoleLog("Invalid message id");
          }
        } catch (ex) {
          this.consoleError(ex);
          //return { error: ex };
        }
      }
    }

    return updatedMessages;
  }

  async deleteMessage(param: any, socket_id: string): Promise<any> {
    this.consoleLog(socket_id);
    if (!param.token) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const rooms = this.onlineService.getRoomIDsByUser(param.token);
    if (rooms.length < 1) {
      this.consoleError(param);
      return { code: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }

    if (!param.room_id) {
      this.consoleError(param);
      return {
        error:
          m_constants.RESPONSE_SOCKET_ERROR.resCodeSocketDeleteMessageNoRoomID,
      };
    }

    const room = await this.roomService.findById(param.room_id);
    if (!room) {
      this.onlineService.removeRoom(param.room_id);
      return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
    }

    const advisor = await this.userService.findOne(room.advisor_id);
    if (!advisor) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
    }

    if (!param.message_id) {
      this.consoleError(param);
      return {
        code: m_constants.RESPONSE_SOCKET_ERROR
          .resCodeSocketDeleteMessageNoMessageID,
      };
    }

    try {
      await this.messageService.remove(+param.message_id);
      return param;
    } catch (err) {
      this.consoleError(err);
      return { error: m_constants.RESPONSE_ERROR.resCodeDatabaseError };
    }
  }

  logout(param: any, socket_id: string): any {
    //this.consoleLog('param: ', param);
    if (!param || !param.token) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeNoToken };
    }

    const rooms = this.onlineService.getRoomsByUser(param.token);
    if (rooms.length < 1) {
      this.consoleError(param);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidToken };
    }

    const result = [];
    rooms.forEach((room) => {
      let mUser = null;
      let sameUserCount = 0;
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.token == param.token) {
          sameUserCount++;
          mUser = user;
        }
      }

      if (mUser) {
        mUser.same_accounts = sameUserCount;
        result.push(mUser);
      }
    });
    return result;
  }

  disconnect(socket_id: any): any {
    //this.consoleLog(socket_id);

    const rooms = this.onlineService.getRoomsBySocketID(socket_id);
    if (rooms.length < 1) {
      this.consoleError(socket_id);
      return { error: m_constants.RESPONSE_SOCKET_ERROR.resCodeInvalidSocket };
    }

    const result = [];
    rooms.forEach((room) => {
      let mUser = null;
      let sameUserCount = 0;
      for (let i = 0; i < room.users.length; i++) {
        const user = room.users[i];
        if (user.socket_id == socket_id) {
          sameUserCount++;
          mUser = user;
        }
      }

      if (mUser) {
        mUser.same_accounts = sameUserCount;
        result.push(mUser);
      }
    });

    return result;
  }
}
