import { Controller, Get, Param, Res } from '@nestjs/common';
import { join } from 'path';
import { SkipJwtAuth } from '../auth/constants';

const uploadDistDir = join(__dirname, '../../', 'upload_dist');

@Controller('static')
export class StaticController {
  @SkipJwtAuth()
  @Get(':subPath')
  render(@Param('subPath') subPath, @Res() res) { // 渲染静态文件
    const filePath = join(uploadDistDir, subPath); // 拼接文件路径
    return res.sendFile(filePath); // 返回文件内容
  }
}
