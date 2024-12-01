import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoRepository } from '../db/repositories/TodoRepository';
import { UserRepository } from '../db/repositories/UserRepository';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private userRepository: UserRepository,
  ) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const user = await this.userRepository.findOne(userId);
    const { title, description, media } = createTodoDto;

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.status = createTodoDto.status || TodoStatus.TODO;
    todo.media = media;
    todo.author = user;

    return this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  /**
   * 根据用户ID查找所有待办事项
   * @param userId 用户ID
   * @returns 待办事项列表
   */
  async findAllByUserId(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({ // 根据用户ID查找用户信息
      relations: ['todos'], // 关联查询todos表
      where: { id: userId }, // 匹配用户ID
    });

    return user ? user.todos : [];
  }

  async findOne(id: number): Promise<Todo> {
    return this.todoRepository.findOne(id);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const { title, description, status, media } = updateTodoDto;

    return this.todoRepository.update(id, {
      title,
      description,
      status: status || TodoStatus.TODO,
      media: media || '',
    });
  }

  async remove(id: number) {
    return this.todoRepository.delete({
      id,
    });
  }
}
