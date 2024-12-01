import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

@Entity()
export class User {
  @ApiProperty({ description: '自增 id' })
  @PrimaryGeneratedColumn()
  id: number; // 用户ID,自增主键

  @ApiProperty({ description: '标题' })
  @Column({ length: 500 })
  username: string; // 用户名,最大长度500

  @ApiProperty({ description: '密码' })
  @Exclude()
  @Column({ length: 500 })
  password: string; // 密码,最大长度500,存储时会进行加密

  @ApiProperty({ description: '邮箱' })
  @Column({ length: 500 })
  email: string; // 用户邮箱,最大长度500

  @ApiProperty({ description: '是否为管理员' })
  @Column('int', { default: 1 })
  is_admin?: number; // 是否为管理员,1表示是,0表示否

  @OneToMany(() => Todo, (todo) => todo.author, { cascade: true })
  todos: Todo[]; // 用户创建的所有待办事项

  @BeforeInsert()
  private async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } // 插入数据前对密码进行加密
}
