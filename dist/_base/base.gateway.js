"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGateway = void 0;
const utils_1 = require("../utils/utils");
class BaseGateway {
    consoleLog(...args) {
        console.log(utils_1.getLine(), ...args);
    }
    consoleError(...args) {
        console.error(utils_1.getLine(), ...args);
    }
}
exports.BaseGateway = BaseGateway;
//# sourceMappingURL=base.gateway.js.map