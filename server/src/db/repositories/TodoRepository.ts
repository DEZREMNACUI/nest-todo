import { EntityRepository, Repository } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

/**
 * Todo实体的仓库类
 * 继承自TypeORM的Repository基类
 * 用于处理Todo实体的数据库操作
 */
@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {}
