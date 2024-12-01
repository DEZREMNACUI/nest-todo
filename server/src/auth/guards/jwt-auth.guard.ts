import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 构造函数
   * @param reflector 反射器,用于获取元数据
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 判断是否可以激活路由
   * @param context 执行上下文
   * @returns 返回是否可以访问路由
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取路由的公开访问标记
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 获取路由处理函数
      context.getClass(), // 获取控制器类
    ]);

    // 如果路由标记为公开访问,则跳过认证
    if (isPublic) return true;

    // 调用父类的canActivate方法进行JWT认证
    return super.canActivate(context);
  }

  /**
   * 处理认证结果
   * @param err 错误信息
   * @param user 用户信息
   * @returns 返回认证通过的用户信息
   * @throws UnauthorizedException 当认证失败时抛出未授权异常
   */
  handleRequest(err, user) {
    // 如果有错误或用户信息不存在,则抛出异常
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
