import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageData } from './chat.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';

@WebSocketGateway({
  path: '/chat/socket.io', // WebSocket 连接路径
  cors: { origin: 'http://localhost:3000' }, // 允许跨域访问的源
})
export class ChatGateway {
  @WebSocketServer()
  server: Server; // Socket.io 服务器实例

  @UseGuards(WsJwtAuthGuard) // 使用 WebSocket JWT 认证守卫
  @SubscribeMessage('clientToServer') // 订阅客户端发送的消息
  async clientToServer(
    @MessageBody() clientData: MessageData, // 接收客户端发送的消息数据
  ): Promise<MessageData> {
    console.log('客户消息: ', clientData.content);
    return { content: '你好，我是小帅，很高兴为你服务！' }; // 返回响应消息
  }

  @UseGuards(WsJwtAuthGuard) // 使用 WebSocket JWT 认证守卫
  @Cron(CronExpression.EVERY_10_SECONDS) // 每10秒执行一次的定时任务
  async sayHi() {
    this.server.emit('serverToClient', { content: '你还在么？' }); // 向所有连接的客户端广播消息
  }
}
