"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const jwt = __importStar(require("jsonwebtoken"));
const constants_1 = require("../../auth/constants");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let AuthMiddleware = class AuthMiddleware {
    async use(req, res, next) {
        const authHeaders = req.headers.authorization;
        if (authHeaders && authHeaders.split(" ")[1]) {
            try {
                const token = authHeaders.split(" ")[1];
                const decoded = jwt.verify(token, constants_1.jwtConstants.secret);
                const user = await typeorm_1.getRepository(user_entity_1.User).findOne(decoded.user.id);
                if (!user) {
                    throw new http_exception_1.HttpException("User not found.", common_1.HttpStatus.UNAUTHORIZED);
                }
                req['user'] = user;
                next();
            }
            catch (ex) {
                throw new http_exception_1.HttpException(ex.message, common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new http_exception_1.HttpException("Not authorized.", common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
AuthMiddleware = __decorate([
    common_1.Injectable()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map