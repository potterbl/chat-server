import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat} from "../entities/chat.entity";
import {Message} from "../entities/message.entity";
import {AppGateway} from "../app.gateway";

@Module({
  imports: [
      TypeOrmModule.forFeature([Chat, Message]),
  ],
  providers: [ChatService, AppGateway],
  controllers: [ChatController]
})
export class ChatModule {}
