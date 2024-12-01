import { Module } from '@nestjs/common';
import { ReportLogger } from './ReportLogger';

/**
 * 日志模块
 * 提供日志记录功能
 * 
 * providers: 提供ReportLogger服务
 * exports: 导出ReportLogger服务供其他模块使用
 */
@Module({
  providers: [ReportLogger],
  exports: [ReportLogger],
})
export class LogModule {}
