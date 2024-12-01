import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { staticBaseUrl } from './constants';

@ApiTags('文件上传')
@ApiBearerAuth() // 启用Bearer Token认证
@Controller('upload') // 定义上传控制器路由前缀
export class UploadController {
  @Post('file') // 处理单文件上传的POST请求
  @UseInterceptors(FileInterceptor('file')) // 使用文件拦截器处理上传的文件
  uploadFile(@UploadedFile() file: Express.Multer.File) { // 获取上传的单个文件
    return {
      file: staticBaseUrl + file.originalname, // 返回文件访问URL
    };
  }

  @Post('files') // 处理多文件上传的POST请求
  @UseInterceptors(FileInterceptor('files')) // 使用文件拦截器处理上传的多个文件
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) { // 获取上传的多个文件
    return {
      files: files.map((f) => staticBaseUrl + f.originalname), // 返回所有文件的访问URL数组
    };
  }
}
