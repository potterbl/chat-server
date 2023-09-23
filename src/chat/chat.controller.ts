import {Body, Controller, Param, Post, Put} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {MessageDto} from "../dto/message.dto";

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService
    ) {
    }

    @Post('/create')
    createChat(@Body('usersId') usersId: number[], @Body('token') token){
        return this.chatService.createChat(usersId, token)
    }

    @Post('/sendMessage')
    sendMessage(@Body() message: MessageDto, @Body('token') token){
        return this.chatService.sendMessage(message, token)
    }

    @Post('/user')
    getAllChats(@Body('token') token){
        return this.chatService.getAllChats(token)
    }

    @Put('/message')
    seenMessage(@Body('messageId') messageId, @Body('token') token){
        return this.chatService.seenMessage(messageId, token)
    }

    // @Post('/:chatId')
    // getChat(@Param('chatId') chatId, @Body('userId') userId, @Body('token') token){
    //     return this.chatService.getChat(chatId, token)
    // }
}
