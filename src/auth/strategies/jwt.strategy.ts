import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "src/guards/enum/role.enum";
import { UserService } from "src/user/user.service";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    if (payload.user) {
      if (
        payload.user.role == Role.Admin ||
        payload.user.role == Role.Advisor
      ) {
        const user = await this.userService.findOne(payload.user.id);
        if (!user || user.status !== 1) {
          return false;
        }
      }
    }
    return payload.user;
  }
}
