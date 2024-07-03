import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { BaseController } from "src/_base/base.controller";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "src/guards/roles.decorator";
import { urls } from "src/utils/config_local";
import { NexeroneService } from "src/nexerone/nexerone.service";

@Controller("message")
export class MessageController extends BaseController {
  constructor(
    private readonly messageService: MessageService,
    private readonly nexeronService: NexeroneService
  ) {
    super();
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get("room/:room_id")
  async findRoomMessages(
    @Request() req: any,
    @Param("room_id") room_id: string,
    @Query() query: any
  ) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        //return this.response(result);
      }
    }
    const offset = query.offset;
    const limit = query.limit;

    const messages = await this.messageService.findRoomMessages(
      room_id,
      offset,
      limit,
      req.user.role
    );
    return this.response(messages);
  }

  @Get("last/:room_id")
  async findRoomLastMessages(
    @Request() req: any,
    @Param("room_id") room_id: string,
    @Query() query: any
  ) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        //return this.response(result);
      }
    }
    const email = req.user.email;
    const message_id = query.last_message_id;

    const messages = await this.messageService.findRoomLastMessages(
      email,
      room_id,
      message_id,
      req.user.role
    );
    return this.response(messages);
  }

  @Get("advisor")
  async findAdvisorMessages(@Request() req: any) {
    const advisor_id = req.user.id;
    return this.response(
      await this.messageService.findRoomsWithMessages(advisor_id)
    );
  }

  @Get("advisor_unread_messages")
  async advisorUnreadMessages(@Request() req: any) {
    const advisor_id = req.user.id;
    return this.response(
      await this.messageService.getAdvisorUnreadMessages(advisor_id)
    );
  }

  @Post("clear_room_messages/:room_id")
  async clearRoomMessages(
    @Request() req: any,
    @Param("room_id") room_id: string
  ) {
    const clientToken = req.headers.accesstoken;
    if (clientToken) {
      const result = await this.nexeronService.verifyClientToken(clientToken);
      if (result.error) {
        //return this.response(result);
      }
    }
    return this.response(
      await this.messageService.clearRoomMessages(
        req.user,
        room_id,
        req.user.role
      )
    );
  }

  @Post("clear_advisor_messages")
  async clearAdvisorMessages(@Request() req: any, @Body() client: any) {
    const advisor_id = req.user.id;
    return this.response(
      await this.messageService.clearAdvisorMessages(advisor_id, client.email)
    );
  }

  @Post("clear_client_messages")
  async clearClientMessages(@Request() req: any) {
    const client_id = req.user.email;
    return this.response(
      await this.messageService.clearClientMessages(client_id)
    );
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.consoleLog(file);
    file["url"] = urls.BASE_URL + urls.MESSAGE_FILE_URL + file.filename;
    return this.response(file);
  }

  @Public()
  @Get("file/:filename")
  getFile(@Param("filename") filename: string, @Res() res) {
    return res.sendFile(filename, { root: "uploads/client" });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.messageService.remove(+id);
  }

  @Post("updateRoomsWithClientPhoto")
  async updateRoomsWithClientPhoto() {
    return await this.messageService.updateRoomsWithClientPhoto();
  }

}
