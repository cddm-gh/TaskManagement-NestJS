import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 123, username: 'testuser' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TaskRepository, useFactory: mockTaskRepository }],
    }).compile();
    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('findAll', () => {
    it('finds all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: FilterTaskDto = { status: TaskStatus.IN_PROGRESS, search: 'Search query' };
      const result = await tasksService.findAll(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should get a task by its id', async () => {
      const mockedTask = {
        title: 'Test title',
        description: 'Test description',
      };
      taskRepository.findOne.mockResolvedValue(mockedTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(result).toEqual(mockedTask);
    });

    it('throws error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const mockedTask = {
        id: 1,
        title: 'Test title',
        description: 'Test description',
      };
      taskRepository.createTask.mockResolvedValue(mockedTask);
      const createTaskDto: CreateTaskDto = { title: 'Test Title', description: 'Test Description' };
      const result = await tasksService.create(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(mockedTask);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.delete() to remove a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('throws NotFoundException when task was not found to delete it', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('updates a task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      const mockTask = {
        id: 1,
        status: TaskStatus.OPEN,
        save,
      };
      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksService.updateTask(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });

    it('throws exception as task is not found to update it', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.updateTask(1, TaskStatus.IN_PROGRESS, mockUser)).rejects.toThrow();
    });
  });
});
