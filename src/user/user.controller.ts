import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Role } from "src/guards/enum/role.enum";
import { Public, Roles } from "src/guards/roles.decorator";
import { m_constants } from "src/utils/const";
import { getTimezoneList } from "src/utils/utils";
import { BaseController } from "src/_base/base.controller";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("add_advisor")
  @Roles(Role.Admin)
  async addAdvisor(@Body() data: any) {
    return this.response(await this.userService.add(data));
  }

  @Get()
  async findAll() {
    return this.response(await this.userService.findAll());
  }

  @Get("search")
  async find(@Query() query: any) {
    const page = query.page;
    if (!page) {
      return this.response({
        error: m_constants.RESPONSE_ERROR.resCodeInvalidData,
      });
    }
    const limit = query.limit;
    const role = Role.Advisor; //query.role;
    const status = query.status;
    const search_key = query.q;
    return this.response(
      await this.userService.find(+page, +limit, role, status, search_key)
    );
  }

  @Post("update_profile")
  async updateProfile(@Request() req: any, @Body() udto: UpdateUserDto) {
    if (!udto.user_id || udto.user_id == req.user.id) {
      const res = await this.userService.update(+req.user.id, udto);
      return this.response(res);
    } else {
      const user = await this.userService.findOne(+req.user.id);
      if (!user) {
        return this.response({
          error: m_constants.RESPONSE_API_ERROR.resCodeInvalidAdvisor,
        });
      }

      if (user.role == "admin") {
        const res = await this.userService.update(+udto.user_id, udto);
        return this.response(res);
      } else {
        return this.response({
          error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
        });
      }
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.Admin)
  async remove(@Param("id") id: string) {
    return this.response(await this.userService.remove(+id));
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    return this.response(req.user);
  }

  @Post("update_photo")
  @UseInterceptors(FileInterceptor("image"))
  async updatePhoto(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateDto = new UpdateUserDto();
    this.consoleLog(file);
    updateDto.photo = file.filename;

    const user_id = req.body ? (req.body.user_id ? req.body.user_id : 0) : 0;
    if (user_id == 0) {
      const res = await this.userService.update(+req.user.id, updateDto);
      return this.response(res);
    } else {
      if (isNaN(user_id)) {
        return this.response({
          error: m_constants.RESPONSE_ERROR.resCodeInvalidData,
        });
      }

      const user = await this.userService.findOne(+req.user.id);
      if (user.role == "admin") {
        const res = await this.userService.update(user_id, updateDto);
        this.consoleLog(res);
        return this.response(res);
      }
      if (user.id == user_id) {
        const res = await this.userService.update(user_id, updateDto);
        this.consoleLog(res);
        return this.response(res);
      } else {
        return this.response({
          error: m_constants.RESPONSE_ERROR.resCodeInvalidPermisson,
        });
      }
    }
  }

  @Public()
  @Get("profile_photo/:file")
  getProfilePhoto(@Param("file") file: string, @Res() res) {
    return res.sendFile(file, { root: "uploads/profile" });
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.response(file);
  }

  @Post("uploads")
  @UseInterceptors(FilesInterceptor("files"))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    this.consoleLog(files);
    return this.response(files);
  }

  @Public()
  @Get("timezone_list")
  timezoneList() {
    return this.response(getTimezoneList());
  }

  @Public()
  @Get("test")
  test(@Request() req: any) {
    const localDate = new Date();
    this.consoleLog("test:", localDate);
    this.consoleLog(localDate.toISOString());

    // const curSeconds = localDate.getTime();
    // const date = new Date(curSeconds);

    // const utcYear = localDate.getUTCFullYear();
    // const utcMonth = localDate.getUTCMonth();
    // const utcDate = localDate.getUTCDate();
    // const utcHour = localDate.getUTCHours();
    // const utcMinute = localDate.getUTCMinutes();
    // const utcSeconds = localDate.getUTCSeconds();

    // this.consoleLog(`${utcYear}-${utcMonth+1}-${utcDate} ${utcHour}:${utcMinute}:${utcSeconds}`)

    return this.response(req.user);
  }
}
