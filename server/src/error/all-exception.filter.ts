import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取HTTP上下文
    const ctx = host.switchToHttp();
    // 获取响应对象
    const response = ctx.getResponse();
    // 获取请求对象
    const request = ctx.getRequest();

    // 获取HTTP状态码,如果是HTTP异常则使用其状态码,否则使用500内部错误
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 返回统一的错误响应格式
    response.status(status).json({
      retcode: status,
      message: (exception as RuntimeException).message || 'Internal Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
