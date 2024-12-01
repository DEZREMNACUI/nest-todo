import { CACHE_MANAGER, Controller, Get, Inject, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SkipJwtAuth } from '../auth/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('访问量')
@SkipJwtAuth()
@Controller('count')
export class CountController {
  /**
   * 构造函数
   * @param cacheManager 缓存管理器实例,用于存储访问计数
   */
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 获取当前访问量
   * @returns 返回当前访问计数
   */
  @Get()
  async getCount() {
    const count: number = await this.cacheManager.get('count');
    return { count: count || 0 };
  }

  /**
   * 更新访问量
   * @returns 返回更新后的访问计数
   */
  @Post()
  async updateCount() {
    const { count } = await this.getCount(); // 获取当前访问量
    await this.cacheManager.set('count', count + 1, { ttl: 0 }); // 将访问量加1并永久保存
    return { count: count + 1 }; // 返回更新后的访问量
  }
}
