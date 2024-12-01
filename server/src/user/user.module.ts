import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../db/repositories/UserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])], // 导入UserRepository以便在模块中使用
  controllers: [UserController], // 声明UserController作为控制器
  providers: [UserService], // 声明UserService作为服务提供者
  exports: [UserService], // 导出UserService以便其他模块使用
})
export class UserModule {}
