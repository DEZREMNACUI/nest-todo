import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './error/http-exception.filter';
import { LogInterceptor } from './log/log.interceptor';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ReportLogger } from './log/ReportLogger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './error/all-exception.filter';

/**
 * 配置 Swagger 文档
 * @param app - NestJS 应用实例
 */
const setupSwagger = (app) => {
  // 创建 Swagger 配置
  const config = new DocumentBuilder()
    .addBearerAuth() // 添加 Bearer 认证
    .setTitle('待办事项') // 设置文档标题
    .setDescription('nest-todo 的 API 文档') // 设置文档描述
    .setVersion('1.0') // 设置版本号
    .build();
  
  // 根据配置创建文档
  const document = SwaggerModule.createDocument(app, config);

  // 设置 Swagger UI
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持认证状态
    },
  });
};

/**
 * 启动应用程序的主函数
 */
async function bootstrap() {
  // 创建日志记录器实例
  const reportLogger = new ReportLogger();

  // 创建 NestJS 应用实例,配置跨域和日志
  // 创建 NestJS 应用实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 配置跨域
    cors: {
      // 允许的源
      origin: ['http://localhost', 'http://localhost:3000'],
      // 允许携带凭证
      credentials: true,
    },
    // 启用日志缓冲
    bufferLogs: true,
    // 使用自定义日志记录器
    logger: reportLogger,
  });

  // 配置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'upload_dist'));

  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  
  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionFilter());
  
  // 注册全局管道,用于参数验证和转换
  // whitelist: true - 自动删除非白名单中的属性(未通过 DTO 类验证的属性)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  
  // 注册全局拦截器
  // LogInterceptor - 用于记录请求和响应日志
  // TransformInterceptor - 用于统一处理响应数据格式
  app.useGlobalInterceptors(
    new LogInterceptor(reportLogger),
    new TransformInterceptor(),
  );

  // 设置 Swagger 文档
  setupSwagger(app);

  // 启动应用并监听端口
  await app.listen(4200);
}

bootstrap();
