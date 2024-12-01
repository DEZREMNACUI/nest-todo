import { Module } from '@nestjs/common';
import * as path from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({ // 注册文件上传模块
      storage: diskStorage({ // 配置磁盘存储
        destination: path.join(__dirname, '../../upload_dist'), // 设置上传文件存储目录
        filename(req, file, cb) { // 设置上传文件名称
          cb(null, file.originalname); // 使用原始文件名
        },
      }),
    }),
  ],
  controllers: [UploadController], // 注册上传控制器
  providers: [UploadService], // 注册上传服务
})
export class UploadModule {}
