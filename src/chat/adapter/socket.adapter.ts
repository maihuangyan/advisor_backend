import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "https";
import { socketConfigs } from "src/utils/config_local";

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    }
  ) {
    const mOptions = {
      allowEIO3: true,
      cors: true,
      namespace: socketConfigs.socketNameSpace,
    };

    const server = super.createIOServer(socketConfigs.socketServerPort, {
      ...options,
      ...mOptions,
    });
    console.log({ ...options, ...mOptions });
    return server;
  }
}
