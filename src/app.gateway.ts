import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server
  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, payload){
    this.server.emit(`user_${payload.userId}`, payload.chatId)
  }
}
