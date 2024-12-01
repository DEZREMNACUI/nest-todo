import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './entities/user.entity';

/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */
@ApiTags('用户详情')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建新用户
   * @param createUserDto - 创建用户的数据传输对象
   * @returns 创建的用户实体
   */
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: User })
  @UseInterceptors(ClassSerializerInterceptor) // 使用类序列化拦截器,用于在响应中排除被@Exclude()装饰的属性
  @Post() // 处理POST请求,用于创建新用户
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取所有用户列表
   * 需要管理员权限
   * @returns 用户列表
   */
  @ApiResponse({ type: [User] })
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * 根据ID查找单个用户
   * @param id - 用户ID
   * @returns 用户实体
   */
  @ApiResponse({ type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * 更新用户信息
   * @param id - 用户ID
   * @param updateUserDto - 更新用户的数据传输对象
   * @returns 更新结果
   */
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ type: User })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * 删除用户
   * @param id - 用户ID
   * @returns 删除结果
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
