import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户
   * @param username 用户名
   * @param password 密码
   * @returns 如果验证成功返回用户信息(不含密码),验证失败返回null
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<null | Omit<User, 'password'>> {
    // 根据用户名查找用户
    const existUser = await this.userService.findByUsername(username);

    // 用户不存在则返回null
    if (!existUser) {
      return null;
    }

    // 比较密码是否匹配
    const isMatch = await bcrypt.compare(password, existUser.password);

    // 密码不匹配则返回null
    if (!isMatch) {
      return null;
    }

    // 解构用户信息,去除密码字段
    const { password: ignorePass, ...restUser } = existUser;

    // 返回不含密码的用户信息
    return restUser;
  }

  /**
   * 用户登录
   * @param user 用户对象
   * @returns 返回包含token、用户信息和过期时间的对象
   */
  async login(user: User) {
    // 解构用户对象,去除密码字段
    const { password, ...restUser } = user;

    // 构建JWT payload
    const payload = { ...restUser, sub: user.id };

    // 返回登录结果
    return {
      token: this.jwtService.sign(payload), // 生成JWT token
      user: restUser, // 返回不含密码的用户信息
      expiresIn: jwtConstants.expiresIn, // token过期时间(分钟)
    };
  }
}
