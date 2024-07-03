import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { NexeroneModule } from "src/nexerone/nexerone.module";
import { ClientModule } from "src/client/client.module";

@Module({
  imports: [
    UserModule,
    PassportModule,
    NexeroneModule,
    ClientModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
