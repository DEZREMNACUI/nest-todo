import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // JWT认证策略类,继承自PassportStrategy
  constructor(private userService: UserService) { // 构造函数,注入UserService
    super({ // 配置JWT策略选项
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取Bearer Token
      ignoreExpiration: false, // 不忽略token过期
      secretOrKey: jwtConstants.secret, // 设置验证密钥
    });
  }

  async validate(payload: any) {
    const existUser = this.userService.findOne(payload.sub);

    if (!existUser) {
      throw new UnauthorizedException();
    }

    return { ...payload, id: payload.sub };
  }
}
