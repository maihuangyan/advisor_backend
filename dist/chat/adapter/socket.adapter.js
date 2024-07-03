"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const config_local_1 = require("../../utils/config_local");
class SocketAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const mOptions = {
            allowEIO3: true,
            cors: true,
            namespace: config_local_1.socketConfigs.socketNameSpace,
        };
        const server = super.createIOServer(config_local_1.socketConfigs.socketServerPort, Object.assign(Object.assign({}, options), mOptions));
        console.log(Object.assign(Object.assign({}, options), mOptions));
        return server;
    }
}
exports.SocketAdapter = SocketAdapter;
//# sourceMappingURL=socket.adapter.js.map