import { SchedulerRegistry } from "@nestjs/schedule";
import { getLine } from "src/utils/utils";

export class BaseService {

  private mSchedulerRegistry: SchedulerRegistry

  consoleLog(...args: any[]) {
    console.log(getLine(), ...args);
  }

  consoleError(...args: any[]) {
    console.error(getLine(), ...args);
  }

  setSchedulerRegistry(schedulerRegistry: SchedulerRegistry) {
    this.mSchedulerRegistry = schedulerRegistry;
  }

  clearTimeout(name: string) {
    try {
      const timeout = this.mSchedulerRegistry.getTimeout(name);
      this.mSchedulerRegistry.deleteTimeout(name);
      clearTimeout(timeout);
    }
    catch (e) {
      this.consoleError(e)
    }
  }

  addTimeout(name: string, milliseconds: number, callback: Function) {
    this.clearTimeout(name);
    const timeout = setTimeout(callback, milliseconds);
    this.mSchedulerRegistry.addTimeout(name, timeout);
  }

}
