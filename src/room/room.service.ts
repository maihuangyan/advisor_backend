import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { m_constants } from "src/utils/const";
import { BaseService } from "src/_base/base.service";
import { Repository } from "typeorm";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./entities/room.entity";

@Injectable()
export class RoomService extends BaseService {

  constructor(
    @InjectRepository(Room)
    private mRepository: Repository<Room>
  ) {
    super();
  }

  async createIfNotExist(createRoomDto: CreateRoomDto): Promise<any> {
    const { advisor_id, client_id } = createRoomDto;
    this.consoleLog("createRoomDto", createRoomDto);
    const room = await this.findByAdvisorAndClient(advisor_id, client_id);
    if (room) {
      return room;
    } else {
      return await this.create(createRoomDto);
    }
  }

  async create(createRoomDto: CreateRoomDto): Promise<any> {
    const newRoom = new Room();
    newRoom.advisor_id = createRoomDto.advisor_id;
    newRoom.client_id = createRoomDto.client_id;
    newRoom.client_name = createRoomDto.client_name;
    newRoom.client_photo = createRoomDto.client_photo
      ? createRoomDto.client_photo
      : "";

    const errors = await validate(newRoom);
    this.consoleLog("errors", errors);
    if (errors.length > 0) {
      return { error: m_constants.RESPONSE_ERROR.resCodeInvalidData };
    }

    const savedItem = await this.mRepository.save(newRoom);
    return { room: savedItem };
  }

  async findAll(): Promise<Room[]> {
    return await this.mRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    return await this.mRepository.findOne(id);
  }

  async findByAdvisorAndClient(
    advisor_id: number,
    client_id: string
  ): Promise<Room> {
    const rooms = await this.mRepository.find({ advisor_id, client_id });
    if (rooms.length > 0) {
      return rooms[0];
    } else {
      return null;
    }
  }

  async findById(id: number): Promise<Room> {
    return await this.mRepository.findOne(id);
  }

  async findRooms(client_ids: string[]): Promise<Room[]> {
    const qb = this.mRepository
      .createQueryBuilder()
      .where("client_id IN (:...client_ids)", { client_ids });
    return await qb.getMany();
  }

  async findAdvisorRooms(advisor_id: number): Promise<Room[]> {
    return (await this.mRepository.find({ advisor_id })) as Room[];
  }

  async findClientRooms(client_id: string): Promise<Room[]> {
    return (await this.mRepository.find({ client_id })) as Room[];
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
    room.advisor_id = dto.advisor_id;
    room.client_id = dto.client_id;
    room.client_name = dto.client_name;
    room.client_photo = dto.client_photo;
    return await this.mRepository.save(room);
  }

  async remove(id: number) {
    await this.mRepository.delete(id);
  }

  async removeAdvisorRooms(advisor_id: number) {
    await this.mRepository
      .createQueryBuilder()
      .delete()
      .where("advisor_id = :advisor_id", { advisor_id })
      .execute();
  }
}
