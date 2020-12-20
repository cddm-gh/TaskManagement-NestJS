import { Task } from './entities/task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async findAll(filterTaskDto: FilterTaskDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException(`Task with id: ${id} was not found.`);
    return task;
  }

  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async deleteTask(id: number, user: User): Promise<string> {
    const { affected } = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (!affected) throw new NotFoundException(`Task with id:${id} was not found`);
    return `Task with id: ${id} was succesfully deleted`;
  }
}
