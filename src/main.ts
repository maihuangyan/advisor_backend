import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SocketAdapter } from "./chat/adapter/socket.adapter";
// import { httpsOptions } from "./utils/https.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions: httpsOptions
  // });
  app.setGlobalPrefix("api/v1");
  app.enableCors();
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
