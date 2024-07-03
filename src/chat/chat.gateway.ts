import {
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Server, Socket } from "socket.io";
import { m_constants } from "src/utils/const";
import { socketConfigs, urls } from "src/utils/config_local";
import { RoomUser } from "src/online/entities/room-user";
import { isArray } from "class-validator";
import { OnlineService } from "src/online/online.service";
import { BaseGateway } from "src/_base/base.gateway";

@WebSocketGateway({ cors: true })
export class ChatGateway extends BaseGateway implements OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly onlineService: OnlineService
  ) {
    super();
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_LOGIN)
  async handleLoginEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = await this.chatService.login(data, client.id);
    if (result.error) {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    } else {
      if (result.room_ids && isArray(result.room_ids)) {
        result.room_ids.forEach((room_id: string) => {
          const param = { ...result };
          delete param.room_ids;
          param.room_id = room_id;
          this.joinRoom(param, client);
        });
      } else if (result.room_id) {
        this.joinRoom(result, client);
      }
    }
  }

  joinRoom(param: any, client: Socket) {
    let roomUserIDs = "";
    const room = this.onlineService.getRoom(param.room_id);
    if (room && room.users && room.users.length > 0) {
      for (const user of room.users) {
        if (param.user_id != user.user_id) {
          if (roomUserIDs) {
            roomUserIDs += "," + user.user_id;
          } else {
            roomUserIDs += user.user_id;
          }
        }
      }
    }
    param.already_joined_user_ids = roomUserIDs;

    client.join(param.room_id.toString());
    this.server
      .of(socketConfigs.socketNameSpace)
      .in(param.room_id.toString())
      .emit(m_constants.SOCKET_EVENTS.SOCKET_NEW_USER, param);

    //this.consoleLog('ChatGateway.js:65 user login param - ', param);
    const newUser = new RoomUser(
      param.token,
      param.user_id,
      param.room_id,
      client.id
    );
    this.onlineService.addUser(newUser);
    this.onlineService.pairSocketIDandToken(client.id, param.token);
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_SEND_TYPING)
  async handleTypingEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = await this.chatService.typing(data, client.id);
    //this.consoleError(result);
    if (result.error) {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    } else {
      this.server
        .of(socketConfigs.socketNameSpace)
        .in(result.room_id.toString())
        .emit(m_constants.SOCKET_EVENTS.SOCKET_TYPING, result);
    }
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_SEND_MESSAGE)
  async handleMessageEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = await this.chatService.sendMessage(data, client.id);
    //this.consoleError(result);
    if (result.error) {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    } else {
      this.server
        .of(socketConfigs.socketNameSpace)
        .in(result.room_id.toString())
        .emit(m_constants.SOCKET_EVENTS.SOCKET_NEW_MESSAGE, result);
    }
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_OPEN_MESSAGE)
  async handleOpenMessageEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = await this.chatService.openMessage(data, client.id);
    //this.consoleError(result);

    if (result.error) {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    } else {
      if (result.length > 0) {
        // send updated messages
        //this.consoleLog('ChatGateway.js:79 - ', result);
        this.server
          .of(socketConfigs.socketNameSpace)
          .in(result[0].room_id.toString())
          .emit(m_constants.SOCKET_EVENTS.SOCKET_UPDATE_MESSAGE, result);
      }
    }
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE)
  async handleDeleteMessageEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = await this.chatService.deleteMessage(data, client.id);
    this.consoleError(result);

    if (result.error) {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    } else {
      this.server
        .of(socketConfigs.socketNameSpace)
        .in(result.room_id.toString())
        .emit(
          m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE,
          result.message_id
        );
      client.emit(
        m_constants.SOCKET_EVENTS.SOCKET_DELETE_MESSAGE,
        result.message_id
      );
      this.consoleLog(
        "room_id: %s, message_id: %s",
        result.room_id,
        result.message_id
      );
    }
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_LOGOUT)
  handleLogoutEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    const result = this.chatService.logout(data, client.id);
    //this.consoleError('result);

    if (isArray(result) && result.length > 0) {
      result.forEach((user) => {
        client.leave(user.room_id.toString());
        this.server
          .of(socketConfigs.socketNameSpace)
          .in(user.room_id.toString())
          .emit(m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
        this.onlineService.removeUser(user.room_id, user.token);
      });
    } else {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    }
  }

  @SubscribeMessage(m_constants.SOCKET_EVENTS.SOCKET_DISCONNECT)
  handleDisconnectEvent(@ConnectedSocket() client: Socket) {
    const result = this.chatService.disconnect(client.id);
    //this.consoleError('result);

    if (isArray(result) && result.length > 0) {
      result.forEach((user) => {
        client.leave(user.room_id.toString());
        this.server
          .of(socketConfigs.socketNameSpace)
          .in(user.room_id.toString())
          .emit(m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
        this.onlineService.removeUser(user.room_id, user.token);
      });
    } else {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    }
  }

  handleDisconnect(client: Socket) {
    const result = this.chatService.disconnect(client.id);
    //this.consoleError('result);

    if (isArray(result) && result.length > 0) {
      result.forEach((user:any) => {
        client.leave(user.room_id.toString());
        this.server
          .of(socketConfigs.socketNameSpace)
          .in(user.room_id.toString())
          .emit(m_constants.SOCKET_EVENTS.SOCKET_USER_LEFT, user);
        this.onlineService.removeUser(user.room_id, user.token);
      });
    } else {
      client.emit(m_constants.SOCKET_EVENTS.SOCKET_ERROR, {
        code: result.error,
      });
    }
  }
}
