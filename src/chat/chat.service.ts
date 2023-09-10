import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "../entities/chat.entity";
import {Repository} from "typeorm";
import {NotFoundError} from "rxjs";
import {Message} from "../entities/message.entity";
import {AppGateway} from "../app.gateway";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chat: Repository<Chat>,
        @InjectRepository(Message)
        private message: Repository<Message>,
        private readonly appGateway: AppGateway
    ) {
    }

    async createChat (between: number[]) {
        const chat = new Chat()
        chat.between = between

        return this.chat.save(chat)
    }

    async sendMessage(message){
        try{
            const candidateChat = await this.chat.findOneBy({id: message.chat})

            if(candidateChat){
                let newMessage = new Message()

                newMessage.message = message.message
                newMessage.from = message.from
                newMessage.chat = candidateChat

                const betweenUsers = candidateChat.between;

                const payload = betweenUsers.map(userId => ({
                    userId,
                    chatId: candidateChat.id
                }));

                payload.forEach(data => {
                    this.appGateway.server.emit('newMessage', data);
                });

                return await this.message.save(newMessage)
            } else {
                throw new NotFoundError('Чат не найдено')
            }
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    async getChat(id, userId){
        const chat =  await this.chat.findOne({where: { id }, relations: ['messages']})

        if(chat && chat.between.includes(userId)){

            return chat
        } else {
            throw new UnauthorizedException()
        }
    }

    async getAllChatsForUser(userId: number) {
        try {
            const chats = await this.chat.find({relations: ["messages"]})

            return chats.filter(chat => chat.between.includes(userId))
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}
