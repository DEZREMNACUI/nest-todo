import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ReportLogger } from './ReportLogger';

/**
 * 日志拦截器
 * 用于记录请求的处理时间和相关信息
 */
export class LogInterceptor implements NestInterceptor {
  /**
   * 构造函数
   * @param reportLogger - 日志记录器实例
   */
  constructor(private reportLogger: ReportLogger) {
    this.reportLogger.setContext('LogInterceptor');
  }

  /**
   * 拦截请求并记录日志
   * @param context - 执行上下文
   * @param next - 后续处理器
   * @returns Observable
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    // 获取HTTP上下文和请求对象
    const http = context.switchToHttp();
    const request = http.getRequest();

    // 记录请求开始的时间戳
    const now = Date.now();
    return next
      .handle()  // 处理请求，返回 Observable
      .pipe(     // 开始管道操作
        tap(() => // 在不影响响应数据的情况下执行日志记录
          this.reportLogger.log(
            `${request.method} ${request.url} ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
