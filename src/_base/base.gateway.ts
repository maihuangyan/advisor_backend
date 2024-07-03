import { getLine } from "src/utils/utils";

export class BaseGateway {
  consoleLog(...args: any[]) {
    console.log(getLine(), ...args);
  }

  consoleError(...args: any[]) {
    console.error(getLine(), ...args);
  }
}
