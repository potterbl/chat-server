import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from "socket.io";

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server

  sendServerStart(){
    this.server.emit('started', 'The server is on')
  }

  usersUpdate() {
    this.server.emit('usersUpdate', 'Users was updated')
  }

  chatsUpdate(userId: number){
    this.server.emit(`user_${userId}`, 'Chats was updated')
  }
}
