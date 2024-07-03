"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const const_1 = require("../utils/const");
const utils_1 = require("../utils/utils");
class BaseController {
    response(result) {
        if (result && result.error) {
            if (result.message) {
                return {
                    ResponseCode: result.error,
                    ResponseMessage: result.message,
                    ResponseResult: null,
                };
            }
            else {
                if (const_1.m_constants.ERROR_MESSAGES[result.error]) {
                    return {
                        ResponseCode: result.error,
                        ResponseMessage: const_1.m_constants.ERROR_MESSAGES[result.error],
                        ResponseResult: null,
                    };
                }
                else {
                    return {
                        ResponseCode: const_1.m_constants.RESPONSE_RESULT.resCodeError,
                        ResponseMessage: result.error,
                        ResponseResult: null,
                    };
                }
            }
        }
        else {
            return {
                ResponseCode: const_1.m_constants.RESPONSE_RESULT.resCodeSucceed,
                ResponseMessage: "",
                ResponseResult: result ? result : null,
            };
        }
    }
    consoleLog(...args) {
        console.log(utils_1.getLine(), ...args);
    }
    consoleError(...args) {
        console.error(utils_1.getLine(), ...args);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map