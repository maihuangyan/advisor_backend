import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Public } from "src/guards/roles.decorator";
import { BaseController } from "src/_base/base.controller";
import { CreateEmailDto } from "./dto/create-email.dto";
import { EmailService } from "./email.service";

@Controller("email")
export class EmailController extends BaseController {

  constructor(
    private readonly emailService: EmailService
  ) {
    super();
  }

  @Post("send")
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Request() req: any, @UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: CreateEmailDto): Promise<any> {
    dto.from = req.user.vmail;
    return this.response(await this.emailService.create(req.user.id, files, dto));
  }

  @Get("inbox")
  async getInbox(@Request() req: any): Promise<any> {
    const vmail = req.user.vmail;
    return this.response(await this.emailService.getInbox(vmail));
  }

  @Get("view/:id")
  async getContent(@Param("id") mailId: number): Promise<any> {
    return this.response(await this.emailService.getContent(+mailId));
  }

  @Get("sent")
  async getSent(@Request() req: any): Promise<any> {
    const vmail = req.user.vmail;
    return this.response(await this.emailService.getSent(vmail));
  }

  @Get("draft")
  async getDrafts(@Request() req: any): Promise<any> {
    const vmail = req.user.vmail;
    return this.response(await this.emailService.getDrafts(vmail));
  }

  @Get("trash")
  async getDeleted(@Request() req: any): Promise<any> {
    const vmail = req.user.vmail;
    return this.response(await this.emailService.getTrash(vmail));
  }

  @Post("save-draft")
  @UseInterceptors(AnyFilesInterceptor())
  async saveDraft(@Request() req: any, @UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: CreateEmailDto): Promise<any> {
    dto.from = req.user.vmail;
    return this.response(await this.emailService.saveDraft(req.user.id, files, dto));
  }

  @Post("send-draft/:id")
  async sendDraft(@Param("id") mailId: number): Promise<any> {
    return this.response(await this.emailService.sendDraft(mailId));
  }

  @Post("set-read-unread/:id")
  async setReadUnread(@Param("id") mailId: number, @Body() data: any): Promise<any> {
    return this.response(await this.emailService.setReadUnread(mailId, data.status));
  }

  @Get("trash-or-delete/:id")
  async deleteOrPurge(@Param("id") mailId: number): Promise<any> {
    return this.response(await this.emailService.trashOrDelete(+mailId));
  }

  @Get("trash/:id")
  async trash(@Param("id") mailId: number): Promise<any> {
    return this.response(await this.emailService.trash(+mailId));
  }

  @Get("delete/:id")
  async delete(@Param("id") mailId: number): Promise<any> {
    return this.response(await this.emailService.delete(+mailId));
  }

  @Get("restore/:id")
  async restore(@Request() req: any, @Param("id") mailId: number): Promise<any> {
    const vmail = req.user.vmail;
    return this.response(await this.emailService.restore(vmail, +mailId));
  }

  @Post("trash-many")
  async moveToTrash(@Body() param: any): Promise<any> {
    return this.response(await this.emailService.trashMany(param.email_ids));
  }

  @Post("delete-many")
  async deleteMany(@Body() param: any): Promise<any> {
    return this.response(await this.emailService.deleteMany(param.email_ids));
  }

  @Post("upload")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>): Promise<any[]> {
    return await this.emailService.saveAttachments(files);
  }

  @Public()
  @Get("attachment/:filename")
  getFile(@Param("filename") filename: string, @Res() res) {
    return res.sendFile(filename, { root: "uploads/files" });
  }

}
