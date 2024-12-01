import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from '../db/repositories/UserRepository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 创建新用户
   * @param createUserDto - 创建用户的数据传输对象
   * @returns 创建的用户实体
   */
  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;

    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.is_admin = 1;

    return this.userRepository.save(user);
  }

  /**
   * 获取所有用户列表
   * @returns 用户列表
   */
  async findAll() {
    return this.userRepository.find();
  }

  /**
   * 根据ID查找单个用户
   * @param id - 用户ID
   * @returns 用户实体
   */
  async findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  /**
   * 根据用户名查找用户
   * @param username - 用户名
   * @returns 用户实体
   */
  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * 更新用户信息
   * @param id - 用户ID
   * @param updateUserDto - 更新用户的数据传输对象
   * @returns 更新结果
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password, email } = updateUserDto;

    return this.userRepository.update({ id }, { username, password, email });
  }

  /**
   * 删除用户
   * @param id - 用户ID
   * @returns 删除结果
   */
  async remove(id: number) {
    return this.userRepository.delete({
      id,
    });
  }

  /**
   * 检查用户是否为管理员
   * @param id - 用户ID
   * @returns 如果是管理员返回用户实体，否则返回null
   */
  async checkAdmin(id: number) {
    return this.userRepository.findOne({
      where: { id, is_admin: 1 },
    });
  }
}
