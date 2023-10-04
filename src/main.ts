import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import {ValidationPipe} from "@nestjs/common";
import {AppGateway} from "./app.gateway";
config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT);

  const appGateway = app.get(AppGateway)

  appGateway.sendServerStart()
}
bootstrap();
