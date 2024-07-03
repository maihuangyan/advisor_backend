import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { m_constants } from "src/utils/const";
import { now } from "src/utils/utils";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Message } from "./entities/message.entity";
import { RoomService } from "src/room/room.service";
import { OnlineService } from "src/online/online.service";
import { ClientService } from "src/client/client.service";
import { Role } from "src/guards/enum/role.enum";
import { UserService } from "src/user/user.service";
import { UpdateRoomDto } from "src/room/dto/update-room.dto";
import { urls } from "src/utils/config_local";
import { ConnectionService } from "src/connection/connection.service";

@Injectable()
export class MessageService extends BaseService {
  constructor(
    @InjectRepository(Message)
    private mRepository: Repository<Message>,
    private readonly roomService: RoomService,
    private readonly onlineService: OnlineService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly connectionService: ConnectionService
  ) {
    super();
  }

  async create(createMessageDto: CreateMessageDto): Promise<any> {
    const newMessage = new Message();
    newMessage.local_id = createMessageDto.local_id;
    newMessage.room_id = createMessageDto.room_id;
    newMessage.user_id = createMessageDto.user_id;
    newMessage.message = createMessageDto.message;
    newMessage.type = createMessageDto.type;
    newMessage.created_at = now();
    newMessage.updated_at = now();

    const errors = await validate(newMessage);
    if (errors.length > 0) {
      this.consoleLog("errors", errors);
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    return await this.mRepository.save(newMessage);
  }

  findAll() {
    return `This action returns all message`;
  }

  async findRoomsWithMessages(advisor_id: number) {
    const getRoomsOnlineStatus =
      this.onlineService.getAdvisorRoomsOnlineStatus(advisor_id);

    const result = [];
    const connections = await this.connectionService.advisor_connections(advisor_id)
    const clientEmails = [];
    for (const con of connections) {
      clientEmails.push(con.client_email)
    }

    const rooms = await this.roomService.findRooms(clientEmails);
    for (const room of rooms) {
      const messages = await this.findRoomMessages(
        `${room.id}`,
        0,
        50,
        Role.Advisor
      );
      room.status = getRoomsOnlineStatus[room.id];
      result.push({ room: room, messages: messages });
    }

    return result;
  }

  async findRoomMessages(
    room_id: string,
    offset: number,
    limit: number,
    caller: Role
  ) {
    let cleared_query = "";
    if (caller == Role.Advisor) {
      cleared_query = " and advisor_deleted = 0";
    } else if (caller == Role.User) {
      cleared_query = " and client_deleted = 0";
    }

    const qb = this.mRepository
      .createQueryBuilder()
      .where("room_id = :room_id" + cleared_query, { room_id })
      .orderBy("id", "DESC")
      .limit(limit)
      .offset(offset);
    return await qb.getMany();
  }

  async findRoomLastMessages(
    email: string,
    room_id: string,
    last_message_id: string,
    caller: Role
  ) {
    let cleared_query = "";
    if (caller == Role.Advisor) {
      cleared_query = " and advisor_deleted = 0";
    }
    else if (caller == Role.User) {
      const room = await this.roomService.findById(+room_id);
      if (room.client_id != email) {
        return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidRoom };
      }
      if (room) {
        const advisor = await this.userService.findOne(+room.advisor_id);
        if (!advisor) {
          return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor }
        }
        if (advisor.status !== 1) {
          return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
        }
      }
      else {
        return { error: m_constants.RESPONSE_ERROR.resCodeTokenExpired };
      }

      cleared_query = " and client_deleted = 0";
    }

    const qb = this.mRepository
      .createQueryBuilder()
      .where("room_id = :room_id" + cleared_query, { room_id })
      .andWhere("id > :last_message_id", { last_message_id });
    const messages = await qb.getMany();
    return messages;
  }

  async getAdvisorUnreadMessages(advisor_id: number) {
    const connections = await this.connectionService.advisor_connections(advisor_id)
    const clientEmails = [];
    for (const con of connections) {
      clientEmails.push(con.client_email)
    }

    const rooms = await this.roomService.findRooms(clientEmails);
    if (rooms.length == 0) {
      return [];
    }

    const room_ids = [];
    for (const room of rooms) {
      room_ids.push(room.id);
    }

    //this.consoleLog(room_ids);
    const qb = this.mRepository
      .createQueryBuilder("message")
      .where("message.room_id IN (:...room_ids)", { room_ids })
      .andWhere("message.user_id <> :advisor_id", { advisor_id })
      .andWhere("message.advisor_deleted = 0")
      .andWhere("message.seen_status = 0")
      .andWhere("message.status = 1");
    const messages = await qb.getMany();

    const clients = await this.clientService.findAll();
    const clientsWithMessages = {};

    for (const message of messages) {
      const client = this.findClient(clients, message.user_id);
      if (client) {
        if (clientsWithMessages[client.email]) {
          clientsWithMessages[client.email]["messages"].push(message);
        } else {
          client["messages"] = [message];
          clientsWithMessages[client.email] = client;
        }
      }
    }
    return Object.values(clientsWithMessages);
  }

  findClient(clients: any[], email: string) {
    for (const client of clients) {
      if (client.email == email) {
        return client;
      }
    }
    return null;
  }

  async findOne(id: number): Promise<Message> {
    return await this.mRepository.findOne(id);
  }

  async update(id: number, dto: UpdateMessageDto) {
    const message = await this.mRepository.findOne(id);
    if (message) {
      message.message = dto.message ? dto.message : message.message;
      message.deleted_at = dto.deleted_at ? dto.deleted_at : message.deleted_at;
      message.advisor_deleted =
        dto.advisor_deleted == -1
          ? message.advisor_deleted
          : dto.advisor_deleted;
      message.client_deleted =
        dto.client_deleted == -1 ? message.client_deleted : dto.client_deleted;
      message.updated_at = now();
    }
    return await this.mRepository.save(message);
  }

  async clearRoomMessages(user: any, room_id: string, role: Role) {
    const room = await this.roomService.findById(+room_id);
    if (!room) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidRoom };
    }
    if (room.advisor_id != user.id && room.client_id != user.email) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson };
    }

    this.consoleLog(room_id);
    let data = {};
    if (role == Role.Advisor) {
      data = {
        advisor_deleted: 1,
      };
    } else if (role == Role.User) {
      data = {
        client_deleted: 1,
      };
    } else {
      data = {
        advisor_deleted: 1,
        client_deleted: 1,
      };
    }

    return await this.mRepository
      .createQueryBuilder()
      .update(Message)
      .set(data)
      .where("room_id = :room_id", { room_id })
      .execute();
  }

  async clearAdvisorMessages(advisor_id: number, client_id: string) {
    const room = await this.roomService.findByAdvisorAndClient(
      advisor_id,
      client_id
    );
    this.consoleLog(room);
    if (!room) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInactiveUser };
    }

    return await this.mRepository
      .createQueryBuilder()
      .update(Message)
      .set({ advisor_deleted: 1 })
      .where("room_id = :room_id", { room_id: room.id })
      .execute();
  }

  async clearClientMessages(client_id: string) {
    this.consoleLog(client_id);
    const rooms = await this.roomService.findClientRooms(client_id);
    if (rooms.length > 0) {
      const room_ids = rooms.map((room) => room.id);
      return await this.mRepository
        .createQueryBuilder()
        .update(Message)
        .set({ client_deleted: 1 })
        .where("room_id in (:...room_ids)", { room_ids })
        .execute();
    }

    return true;
  }

  async addSeen(id: number) {
    const result = await this.mRepository
      .createQueryBuilder()
      .update(Message)
      .set({
        updated_at: now(),
        seen_status: 1,
      })
      .where("id = :id", { id })
      .execute();
    this.consoleLog(result);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.mRepository.delete(id);
  }

  async updateRoomsWithClientPhoto() {
    const rooms = await this.roomService.findAll();
    rooms.map(async (item) => {
      const dto = new UpdateRoomDto();
      dto.advisor_id = item.advisor_id
      dto.client_id = item.client_id
      dto.client_name = item.client_name
      const client = await this.clientService.findOneByEmail(item.client_id)
      if (client)
        dto.client_photo = urls.GS_MAIN_API_BASE_URL + 'nexerone/getProfileImage?user_id=' + client.customer_id
      await this.roomService.update(item.id, dto)
    })
    return true;
  }

}
