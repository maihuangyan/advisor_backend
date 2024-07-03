import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { BaseService } from "src/_base/base.service";
import { NexeroneService } from "src/nexerone/nexerone.service";
import { ClientService } from "src/client/client.service";
export declare class AuthService extends BaseService {
    private readonly userService;
    private readonly jwtService;
    private readonly nexeroneService;
    private readonly clientService;
    private saltOrRounds;
    constructor(userService: UserService, jwtService: JwtService, nexeroneService: NexeroneService, clientService: ClientService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): any;
    register(user: any): Promise<any>;
    resetPassword(userId: number, passwords: any): Promise<any>;
    verifyToken(token: string): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    resetForgotPassword(params: any): Promise<any>;
}
