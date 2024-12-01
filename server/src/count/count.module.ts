import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CountController } from './count.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({ // 异步注册缓存模块
      imports: [ConfigModule], // 导入配置模块
      inject: [ConfigService], // 注入配置服务
      useFactory: (configService: ConfigService) => { // 使用工厂函数配置缓存
        const { host, port } = configService.get('redis'); // 从配置中获取redis连接信息
        return {
          store: redisStore, // 使用redis存储
          host, // redis主机地址
          port, // redis端口号
        };
      },
    }),
  ],
  controllers: [CountController], // 控制器
})
export class CountModule {}
