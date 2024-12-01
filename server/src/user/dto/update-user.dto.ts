import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * 更新用户DTO
 * 继承自CreateUserDto,所有字段都是可选的
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
