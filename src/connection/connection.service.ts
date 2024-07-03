/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { AuthService } from "src/auth/auth.service";
import { ClientService } from "src/client/client.service";
import { CreateClientDto } from "src/client/dto/create-client.dto";
import { Client } from "src/client/entities/client.entity";
import { Role } from "src/guards/enum/role.enum";
import { OnlineService } from "src/online/online.service";
import { CreateRoomDto } from "src/room/dto/create-room.dto";
import { RoomService } from "src/room/room.service";
import { UpdateUserDto } from "src/user/dto/update-user.dto";
import { UserService } from "src/user/user.service";
import { m_constants } from "src/utils/const";
import { ZoomService } from "src/zoom/zoom.service";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateConnectionDto } from "./dto/create-connection.dto";
import { UpdateConnectionDto } from "./dto/update-connection.dto";
import { Connection } from "./entities/connection.entity";

@Injectable()
export class ConnectionService extends BaseService {
  constructor(
    @InjectRepository(Connection)
    private mRepository: Repository<Connection>,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly onlineService: OnlineService,
    private readonly roomService: RoomService,
    private readonly zoomService: ZoomService
  ) {
    super();
  }

  async create(dto: CreateConnectionDto, triedSaveClient = false) {
    const connection = await this.findByClientEmail(dto.client_email);
    if (connection) {
      this.consoleLog(dto);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeAlreadyConnected };
    }

    const advisor = await this.userService.findOne(dto.advisor_id);
    if (!advisor) {
      this.consoleLog(dto);
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor };
    }
    if (advisor.email == dto.client_email) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInvalidEmailSameAdvisor };
    }

    const client = await this.clientService.loadAndRegister(dto.client_email);
    if (client.error) {
      return client;
    }

    if (client) {
      const newConnection = new Connection(dto);
      newConnection.client_id = client.id;
      const errors = await validate(newConnection);
      this.consoleLog(errors);
      if (errors.length > 0) {
        return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
      }
      else {
        // Create chat room
        this.roomService.createIfNotExist(
          new CreateRoomDto(
            dto.advisor_id,
            client.email,
            client.fullName,
            client.avatar
          )
        );

        // if (!advisor.zoom_account_id) {
        //   // If the advisor is not registered on zoom user list, register now
        //   const zoomAccountID = await this.zoomService.registerZoomUser(
        //     advisor
        //   );
        //   if (zoomAccountID.error) {
        //     return zoomAccountID;
        //   }
        //   else {
        //     const dto = new UpdateUserDto();
        //     dto.zoom_account_id = zoomAccountID;
        //     this.userService.update(advisor.id, dto);
        //   }
        // }

        const save = await this.mRepository.save(newConnection);
        return { connection: save, client: client };
      }
    } else {
      if (triedSaveClient) {
        return { error: m_constants.RESPONSE_ERROR.resCodeDatabaseError };
      }

      return await this.create(dto, true);
    }
  }

  async advisor_clients(displayCurrency: string, advisor_id: number) {
    const client_ids = [];
    const connections = await this.mRepository.find({ advisor_id });
    connections.forEach((connection) => {
      client_ids.push(connection.client_id);
    });

    if (client_ids.length > 0) {
      return await this.clientService.find_clients(displayCurrency, client_ids);
    }
    else {
      return { total: 0, clients: [], allData: [] };
    }
  }

  async advisor_connections(advisor_id: number) {
    return await this.mRepository.find({ advisor_id });
  }

  async advisor_overview(displayCurrency: string, advisor_id: number, advisor_email: string, refresh: number) {
    const connections = await this.mRepository.find({ advisor_id });
    const client_emails = [];
    connections.forEach((connection) => {
      client_emails.push(connection.client_email);
    });

    if (client_emails.length > 0) {
      return await this.clientService.advisor_overview(displayCurrency, client_emails, refresh);
    }
    else {
      return [];
    }
  }

  async find(
    advisor_id: number,
    page: number,
    limit: number,
    status: string,
    search_key: string,
    displayCurrency: string
  ) {
    const client_ids = [];
    const connections = await this.mRepository.find({ advisor_id });
    connections.forEach((connection) => {
      client_ids.push(connection.client_id);
    });

    if (client_ids.length > 0) {
      return await this.clientService.find(
        client_ids,
        page,
        limit,
        status,
        search_key,
        displayCurrency
      );
    }
    else {
      return { total: 0, clients: [], allData: [] };
    }
  }

  async updateClientFees(data: any) {
    return await this.clientService.updateClientFees(data);
  }

  async findOne(id: number) {
    return await this.mRepository.findOne(id);
  }

  async findAdvisorConnections(advisor_id: number) {
    return await this.mRepository.find({ advisor_id });
  }

  async findConnection(advisor_id: number, client_id: number) {
    return await this.mRepository.findOne({ advisor_id, client_id });
  }

  async findByClient(token: string) {
    const client = await this.clientService.loadAndRegisterBytoken(token);
    if (client.error) {
      return client;
    }

    const connection = await this.findByClientEmail(client.email);
    if (!connection) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeUserNotFound };
    }

    const advisor = await this.userService.findAdvisor(connection.advisor_id);
    if (advisor.error) {
      return advisor;
    }
    if (advisor.status !== 1) {
      return { error: m_constants.RESPONSE_API_ERROR.resCodeInactiveAdvisor };
    }

    advisor.online = this.onlineService.getUserByUserID(advisor.id)
      ? "online"
      : "offline";
    advisor.advisor_service_token = this.authService.login({
      id: client.id,
      email: client.email,
      role: Role.User,
    }).access_token;
    const room = await this.roomService.findByAdvisorAndClient(
      connection.advisor_id,
      client.email
    );
    advisor.room_id = room ? room.id : 0;
    advisor.email = advisor.vmail;
    return advisor;
  }

  async findByClientEmail(client_email: string) {
    return await this.mRepository.findOne({ client_email: client_email.toLowerCase() });
  }

  async update(id: number, dto: UpdateConnectionDto) {
    const connection = await this.findOne(id)
    connection.advisor_id = dto.advisor_id
    connection.client_email = dto.client_email.toLowerCase()
    return await this.mRepository.save(connection);
  }

  async remove(id: number) {
    return await this.mRepository.delete(id);
  }

  async removeConnection(advisor_id: number, client_id: number) {
    const client = await this.clientService.findOne(client_id);
    const room = await this.roomService.findByAdvisorAndClient(
      advisor_id,
      client.email
    );
    if (room) {
      this.roomService.remove(room.id);
    }

    const fee = {
      client_id,
      fee_bps_gold_coin: 0,
      fee_bps_gold_bar: 0,
      fee_bps_gold_storage: 0,
      fee_bps_silver_coin: 0,
      fee_bps_silver_bar: 0,
      fee_bps_silver_storage: 0,
    }
    await this.clientService.updateClientFees(fee)
    return await this.mRepository.delete({ advisor_id, client_id });
  }

  async deleteAdvisor(advisor_id: number) {
    await this.removeAdvisorConnections(advisor_id);
    return await this.userService.remove(advisor_id);
  }

  async removeAdvisorConnections(advisor_id: number) {
    await this.mRepository
      .createQueryBuilder()
      .delete()
      .where("advisor_id = :advisor_id", { advisor_id })
      .execute();
    await this.roomService.removeAdvisorRooms(advisor_id);
  }
}
