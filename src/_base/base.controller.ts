import { m_constants } from "src/utils/const";
import { getLine } from "src/utils/utils";

export class BaseController {

  response(result: any) {
    if (result && result.error) {
      if (result.message) {
        return {
          ResponseCode: result.error,
          ResponseMessage: result.message,
          ResponseResult: null,
        };
      } else {
        if (m_constants.ERROR_MESSAGES[result.error]) {
          return {
            ResponseCode: result.error,
            ResponseMessage: m_constants.ERROR_MESSAGES[result.error],
            ResponseResult: null,
          };
        }
        else {
          return {
            ResponseCode: m_constants.RESPONSE_RESULT.resCodeError,
            ResponseMessage: result.error,
            ResponseResult: null,
          };
        }
      }
    } else {
      return {
        ResponseCode: m_constants.RESPONSE_RESULT.resCodeSucceed,
        ResponseMessage: "",
        ResponseResult: result ? result : null,
      };
    }
  }

  consoleLog(...args: any[]) {
    console.log(getLine(), ...args);
  }

  consoleError(...args: any[]) {
    console.error(getLine(), ...args);
  }
}
