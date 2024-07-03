import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MulterModule } from "@nestjs/platform-express";
import { editFileName } from "src/utils/utils";
import { diskStorage } from "multer";
import { ZoomModule } from "src/zoom/zoom.module";
import { WorkTimeModule } from "src/work-time/work-time.module";
import { ClientModule } from "src/client/client.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: "./uploads/profile",
        storage: diskStorage({
          destination: "./uploads/profile",
          filename: (req, file, cb) => {
            editFileName(req, file, cb);
          },
        }),
      }),
    }),
    ZoomModule,
    WorkTimeModule,
    ClientModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
