import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    LogModule, // 日志模块
    UserModule, // 用户模块
    PassportModule, // 身份验证模块
    JwtModule.register({ // JWT 模块配置
      secret: jwtConstants.secret, // JWT 密钥
      signOptions: { expiresIn: `${jwtConstants.expiresIn}m` }, // token 过期时间,单位:分钟
    }),
  ],
  controllers: [AuthController], // 认证控制器
  providers: [
    AuthService, // 认证服务
    LocalStrategy, // 本地认证策略
    JwtStrategy, // JWT 认证策略
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 全局 JWT 守卫
  ],
  exports: [AuthService], // 导出认证服务
})
export class AuthModule {}
