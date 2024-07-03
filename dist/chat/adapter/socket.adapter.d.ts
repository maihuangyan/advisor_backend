/// <reference types="node" />
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "https";
export declare class SocketAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions & {
        namespace?: string;
        server?: any;
    }): any;
}
