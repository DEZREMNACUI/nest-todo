import loadConfig from './config/configurations';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { StaticModule } from './static/static.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QuoteModule } from './quote/quote.module';
import { CountModule } from './count/count.module';

// Docker环境变量,用于判断是否在Docker容器中运行
const DOCKER_ENV = process.env.DOCKER_ENV;

const businessModules = [ // 业务模块列表
  AuthModule,            // 认证模块
  TodoModule,           // 待办事项模块
  UserModule,           // 用户模块
  UploadModule,         // 文件上传模块
  StaticModule,         // 静态资源模块
  ChatModule,           // 聊天模块
  QuoteModule,          // 报价模块
  CountModule,          // 计数模块
];

// 第三方库模块列表
const libModules = [
  // 配置模块,用于加载配置文件
  ConfigModule.forRoot({
    load: [loadConfig], // 加载自定义配置
    envFilePath: [DOCKER_ENV ? '.docker.env' : '.env'], // 根据环境选择配置文件
  }),
  
  // 定时任务模块
  ScheduleModule.forRoot(),
  
  // TypeORM数据库模块
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule], // 导入配置模块
    inject: [ConfigService], // 注入配置服务
    useFactory: (configService: ConfigService) => {
      // 从配置中获取数据库连接信息
      const { host, port, username, password, database } =
        configService.get('db');

      return {
        type: 'mariadb', // 数据库类型
        // 数据库连接配置,从环境变量获取
        host,
        port,
        username,
        password,
        database,
        // 实体文件路径配置
        entities: ['dist/**/*.entity{.ts,.js}'],
      };
    },
  }),
];

@Module({
  imports: [...libModules, ...businessModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
