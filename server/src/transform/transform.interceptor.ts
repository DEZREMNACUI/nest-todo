import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

/**
 * 响应转换拦截器
 * 用于统一处理响应数据格式
 */
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * 拦截请求并转换响应数据
   * @param context - 执行上下文
   * @param next - 后续处理器
   * @returns Observable
   */
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => ({
        retcode: 0, // 返回码,0表示成功
        message: 'OK', // 响应消息
        data, // 实际响应数据
      })),
    );
  }
}
