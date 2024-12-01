import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipJwtAuth } from './constants';
import { LoginDto } from './dto/LoginDto';

@ApiTags('登录验证')
@Controller('auth')
export class AuthController {
  // 注入 AuthService
  constructor(private authService: AuthService) {}

  // 用户登录接口
  // @ApiBody - 指定请求体类型为 LoginDto
  // @SkipJwtAuth - 跳过 JWT 认证
  // @UseGuards - 使用本地认证守卫
  // @Post - 处理登录请求
  @ApiBody({ type: LoginDto })
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // 调用 authService 的 login 方法处理登录
    return this.authService.login(req.user);
  }
}
