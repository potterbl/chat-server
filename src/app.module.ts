import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import {Chat} from "./entities/chat.entity";
import {User} from "./entities/user.entity";
import {Message} from "./entities/message.entity";
import { AppGateway } from './app.gateway';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.HOSTNAME,
            port: 5432,
            database: process.env.DATABASE_NAME,
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            entities: [User, Chat, Message],
            synchronize: true
        }),
        AuthModule,
        ChatModule
    ],
    providers: [AppGateway],

})
export class AppModule {}
