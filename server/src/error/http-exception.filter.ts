import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP异常过滤器
 * 用于捕获和处理HTTP异常
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 捕获并处理HTTP异常
   * @param exception - HTTP异常对象
   * @param host - 参数主机上下文
   * @returns 处理后的响应结果
   */
  catch(exception: HttpException, host: ArgumentsHost): any {
    // 获取HTTP上下文
    const ctx = host.switchToHttp();
    // 获取响应对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<Request>();
    // 获取异常状态码
    const status = exception.getStatus();

    // 返回格式化的错误响应
    response.status(status).json({
      retcode: status, // 返回状态码
      message: exception.message, // 错误信息
      timestamp: new Date().toISOString(), // 时间戳
      path: request.url, // 请求路径
      data: exception.getResponse(), // 详细错误数据
    });
  }
}
