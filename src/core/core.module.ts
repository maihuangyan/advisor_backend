import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/utils/config_local";

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1800000s" },
    }),
  ],
  exports: [JwtModule],
})
export class CoreModule {}
