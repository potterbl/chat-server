import {Body, Controller, Param, Post} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {MessageDto} from "../dto/message.dto";

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService
    ) {
    }

    @Post('/create')
    createChat(@Body('between') between) {
        return this.chatService.createChat(between)
    }

    @Post('/message')
    sendMessage(@Body() message: MessageDto){
        return this.chatService.sendMessage(message)
    }

    @Post('/user')
    getAllChatsForUser(@Body('userId') userId: number) {
        return this.chatService.getAllChatsForUser(userId);
    }

    @Post('/:chat')
    getChat(@Param('chat') chat: number, @Body('userId') userId: number){
        return this.chatService.getChat(chat, userId)
    }
}
