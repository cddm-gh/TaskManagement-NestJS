import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';

const mockTasks = [
  { id: 1, title: 'title1', description: 'description', status: TaskStatus.OPEN },
  { id: 2, title: 'title2', description: 'description for task', status: TaskStatus.OPEN },
  { id: 3, title: 'title3', description: 'description3', status: TaskStatus.OPEN },
];

describe('TaskRepository', () => {
  let user;
  let taskRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TaskRepository],
    }).compile();
    taskRepository = await module.get<TaskRepository>(TaskRepository);
    user = new User();
  });

  describe('getTasks', () => {
    const filters: FilterTaskDto = {
      status: TaskStatus.OPEN,
      search: 'task',
    };

    it('Returns all the tasks of the user', async () => {
      taskRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTasks),
      });

      const result = await taskRepository.getTasks(filters, user);
      expect(result).toEqual(mockTasks);
    });

    it('throws InternalServerException if getMany fails', async () => {
      taskRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(InternalServerErrorException),
      });
      await expect(taskRepository.getTasks(filters, user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createTask', () => {
    it('should create a new task for the user', async () => {
      const save = jest.fn();
      const createTaskDto: CreateTaskDto = {
        title: 'My Title',
        description: 'My Description',
      };
      taskRepository.create = jest.fn().mockReturnValue({ save });
      const { title, description, status } = await taskRepository.createTask(createTaskDto, user);
      expect(title).toEqual(createTaskDto.title);
      expect(description).toEqual(createTaskDto.description);
      expect(status).toEqual(TaskStatus.OPEN);
    });
  });
});
