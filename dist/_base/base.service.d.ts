import { SchedulerRegistry } from "@nestjs/schedule";
export declare class BaseService {
    private mSchedulerRegistry;
    consoleLog(...args: any[]): void;
    consoleError(...args: any[]): void;
    setSchedulerRegistry(schedulerRegistry: SchedulerRegistry): void;
    clearTimeout(name: string): void;
    addTimeout(name: string, milliseconds: number, callback: Function): void;
}
