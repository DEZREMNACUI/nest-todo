import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserService } from '../../user/user.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
/**
 * WebSocket JWT验证策略类
 * 用于处理WebSocket连接的JWT token验证
 */
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  /**
   * 构造函数
   * @param userService 用户服务实例,用于验证用户
   */
  constructor(private userService: UserService) {
    super({
      // 从WebSocket握手请求头中提取JWT token
      jwtFromRequest: (req) => {
        const { authorization } = req.handshake.headers;
        if (!authorization) {
          return null;
        }

        const [, token] = authorization.split(' ');

        return token;
      },
      // 不忽略token过期
      ignoreExpiration: false,
      // 使用JWT密钥进行验证
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * 验证JWT payload
   * @param payload JWT解码后的数据
   * @returns 验证通过的用户信息
   */
  async validate(payload: any) {
    const existUser = this.userService.findOne(payload.sub);

    if (!existUser) {
      throw new WsException('无法通过验证');
    }

    return { ...payload, id: payload.sub };
  }
}
