"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const socket_adapter_1 = require("./chat/adapter/socket.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api/v1");
    app.enableCors();
    app.useWebSocketAdapter(new socket_adapter_1.SocketAdapter(app));
    await app.listen(3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map