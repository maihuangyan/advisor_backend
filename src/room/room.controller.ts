import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./entities/room.entity";
import { OnlineService } from "src/online/online.service";
import { BaseController } from "src/_base/base.controller";
import { m_constants } from "src/utils/const";

@Controller("room")
export class RoomController extends BaseController {
  constructor(
    private readonly roomService: RoomService,
    private readonly onlineService: OnlineService
  ) {
    super();
  }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roomService.findOne(+id);
  }

  @Get("list")
  async advisorRooms(@Request() req: any) {
    const userID = req.user.id;
    const rooms = await this.roomService.findAdvisorRooms(userID);
    let result = [];
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        let roomUsers = this.onlineService.getRoom(`${room.id}`);
        result.push({
          room: room,
          users: roomUsers.users,
        });
      });
    }
    return this.response(result);
  }

  @Get("online_users/:room_id")
  async onlineUsers(@Param("room_id") room_id: string) {
    const room = this.onlineService.getRoom(room_id);
    if (room) {
      return this.response(room.users);
    } else {
      return this.response({
        error: m_constants.RESPONSE_API_ERROR.resCodeUserListInvalidRoomID,
      });
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roomService.remove(+id);
  }
}
