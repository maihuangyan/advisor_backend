"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = "isPublic";
const Public = () => common_1.SetMetadata(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.ROLES_KEY = "roles";
const Roles = (...roles) => common_1.SetMetadata(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map