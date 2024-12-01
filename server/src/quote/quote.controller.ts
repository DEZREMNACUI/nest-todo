import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipJwtAuth } from '../auth/constants';
import { lastValueFrom } from 'rxjs';
import { QuoteDto } from './dto/quote.dto';

const randomQuoteApi = 'http://api.quotable.io/random';

@ApiTags('名言名句')
@SkipJwtAuth()
@Controller('quote')
export class QuoteController {
  // HTTP服务注入
  constructor(private httpService: HttpService) {}

  // 获取随机名言
  @ApiResponse({ type: QuoteDto })
  @Get('random')
  async getRandomQuote() {
    // 调用外部API获取随机名言
    const response$ = this.httpService.get(randomQuoteApi);
    // 等待响应结果
    const response = await lastValueFrom(response$);
    // 返回名言数据
    return response.data;
  }
}
