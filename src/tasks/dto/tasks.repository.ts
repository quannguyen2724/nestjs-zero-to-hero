/* eslint-disable prettier/prettier */
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from '../task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../task-status.model';
import { GetTasksFilterDto } from './get-tasks-filter.dto';

// @EntityRepository(Task)
// export class TasksRespository extends Repository<Task> {

// }

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
