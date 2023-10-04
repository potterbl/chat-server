import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import * as process from "process";
import {In, Repository} from "typeorm";
import {NotFoundError} from "rxjs";
import * as jwt from 'jsonwebtoken'

import {Chat} from "../entities/chat.entity";
import {Message} from "../entities/message.entity";
import {AppGateway} from "../app.gateway";
import {User} from "../entities/user.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chat: Repository<Chat>,
        @InjectRepository(Message)
        private message: Repository<Message>,
        @InjectRepository(User)
        private user: Repository<User>,
        private readonly appGateway: AppGateway
    ) {
    }

    async createChat (usersId: number[], token) {
        try{
            const candidateUser = jwt.verify(token, process.env.SECRET_KEY)

            if(usersId.some(user => user === candidateUser.id)){
                const userPromises = usersId.map(async (userId) => {
                    const user = await this.user.findOne({ where: { id: userId } });
                    if (user) {
                        return user;
                    }
                });

                const users = (await Promise.all(userPromises)).filter(Boolean);

                if(users.length < 2){
                    throw new NotFoundError('Users not found')
                }

                const existingChat = await this.chat.findOne({
                    relations: {
                        users: true
                    },
                    where: {
                        users: users,
                    },
                });

                if (existingChat && existingChat.users.length === users.length) {
                    throw new Error('Chat already exists');
                }


                const chat = new Chat()
                chat.users = users

                const createdChat = await this.chat.save(chat)

                const usersSend = chat.users.map(user => {
                    return user.id
                })

                usersSend.forEach(userId => {
                    this.appGateway.chatsUpdate(userId)
                })

                return {
                    ...createdChat,
                    users: createdChat.users.map(user => ({
                        id: user.id,
                        name: user.name
                    }))
                };
            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async sendMessage(message, token) {
        try{
            const candidateUser = jwt.verify(token, process.env.SECRET_KEY)

            if(message.from === candidateUser.id){
                const candidateChat = await this.chat.findOne({where: { id: message.chat }, relations: {users: true, messages: true}})

                if(!candidateChat.users.some(user => user.id === message.from)){
                    throw new UnauthorizedException()
                }
                if(candidateChat){
                    let newMessage = new Message()

                    newMessage.message = message.message
                    newMessage.from = message.from
                    newMessage.chat = candidateChat

                    if(message.replied){
                        const candidateMessage = await this.message.findOne({
                            where: {
                                id: message.replied
                            }
                        })

                        if(!candidateChat.messages.some(message => message.id === candidateMessage.id)){
                            throw new NotFoundError("Message wasn't found in this chat")
                        }

                        newMessage.replied = candidateMessage
                    } else {
                        newMessage.replied = null
                    }

                    await this.message.save(newMessage)

                    const users = candidateChat.users.map(user => {
                        return user.id
                    })

                    users.forEach(userId => {
                        this.appGateway.chatsUpdate(userId)
                    })

                    return {message: "Message was sent"}
                } else {
                    throw new NotFoundError("Chat wasn't found")
                }
            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async seenMessage(messageId, token) {
        try {
            const candidate = jwt.verify(token, process.env.SECRET_KEY)
            const candidateUser = await this.user.findOne({
                where: {
                    id: candidate.id
                }
            })

            if(candidateUser){
                const candidateMessage = await this.message.findOne({
                    relations: {
                        chat: true
                    },
                    where: {
                        id: messageId
                    }
                })

                candidateMessage.seen = true

                const candidateChat = await this.chat.findOne({
                    where: {
                        id: candidateMessage.chat.id
                    },
                    relations: {
                        users: true
                    }
                })

                await this.message.save(candidateMessage)

                candidateChat.users.forEach(user => {
                    this.appGateway.chatsUpdate(user.id)
                })

                return {message: 'updated'}
            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async getAllChats(token) {
        try {
            const candidate = jwt.verify(token, process.env.SECRET_KEY);

            if (candidate) {
                const chats = await this.chat.find({
                    relations: ['users', 'messages', 'messages.replied'],
                });

                const filteredChats = chats.filter(chat =>
                    chat.users.some(user => user.id === candidate.id)
                );

                filteredChats.forEach(chat => {
                    chat.messages.sort((message1, message2) => {
                        const createdAt1 = message1.createdAt ? message1.createdAt.getTime() : 0;
                        const createdAt2 = message2.createdAt ? message2.createdAt.getTime() : 0;
                        return createdAt1 - createdAt2;
                    });
                });

                filteredChats.sort((chat1, chat2) => {
                    const lastMessage1 = chat1.messages.length > 0 ? chat1.messages[chat1.messages.length - 1] : null;
                    const lastMessage2 = chat2.messages.length > 0 ? chat2.messages[chat2.messages.length - 1] : null;

                    const createdAt1 = lastMessage1 ? lastMessage1.createdAt.getTime() : chat1.createdAt.getTime();
                    const createdAt2 = lastMessage2 ? lastMessage2.createdAt.getTime() : chat2.createdAt.getTime();

                    return createdAt2 - createdAt1;
                });


                return filteredChats.map(chat => ({
                    ...chat,
                    users: chat.users.map(user => ({
                        id: user.id,
                        name: user.name,
                    }))
                }));
            } else {
                throw new UnauthorizedException();
            }
        } catch (e) {
            throw new Error(e);
        }
    }

}
