import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { jwtConstants } from "src/auth/constants";
import { User } from "src/user/entities/user.entity";
import { getRepository } from "typeorm";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(" ")[1]) {
      try {
        const token = (authHeaders as string).split(" ")[1];

        const decoded: any = jwt.verify(token, jwtConstants.secret);
        const user: User = await getRepository(User).findOne(decoded.user.id);

        if (!user) {
          throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
        }

        req['user'] = user;
        next();
      } catch (ex) {
        throw new HttpException(ex.message, HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException("Not authorized.", HttpStatus.UNAUTHORIZED);
    }
  }
}
