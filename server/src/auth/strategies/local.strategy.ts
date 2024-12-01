import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { ReportLogger } from '../../log/ReportLogger';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // 本地认证策略类,继承自PassportStrategy
  constructor(
    private moduleRef: ModuleRef, // 模块引用,用于获取request-scoped providers
    private reportLogger: ReportLogger, // 日志记录器
  ) {
    super({ passReqToCallback: true }); // 配置策略选项,传递request对象到回调
    this.reportLogger.setContext('LocalStrategy'); // 设置日志上下文为LocalStrategy
  }

  /**
   * 验证用户身份
   * @param request 请求对象
   * @param username 用户名
   * @param password 密码
   * @returns 返回不含密码的用户信息
   * @throws UnauthorizedException 当验证失败时抛出未授权异常
   */
  async validate(
    request: Request,
    username: string, 
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // 根据请求获取上下文ID
    const contextId = ContextIdFactory.getByRequest(request);

    // 获取request-scoped的认证服务实例
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    // 验证用户名和密码
    const user = await authService.validateUser(username, password);

    // 如果验证失败,记录错误日志并抛出未授权异常
    if (!user) {
      this.reportLogger.error('无法登录，SB');
      throw new UnauthorizedException();
    }

    // 返回验证通过的用户信息
    return user;
  }
}
