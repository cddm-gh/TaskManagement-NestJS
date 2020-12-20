import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  it.skip('findAll', () => {});
  // let tasksController: TasksController;
  // let tasksService: TasksService;
  // beforeEach(async () => {
  //   const module = await Test.createTestingModule({
  //     providers: [TasksService],
  //     controllers: [TasksController],
  //   }).compile();
  //   tasksController = await module.get<TasksController>(TasksController);
  //   tasksService = await module.get<TasksService>(TasksService);
  // });
  // describe('findAll', () => {
  //   it('should return an array of tasks', async () => {
  //     const mockTasks = [
  //       { id: 1, title: 'title1', description: 'description1', status: TaskStatus.OPEN },
  //       { id: 2, title: 'title2', description: 'description2', status: TaskStatus.OPEN },
  //     ];
  //     // jest.spyOn(tasksService, 'findAll').mockImplementation(() => mockTasks);
  //     // expect(await tasksController.findAll()).toBe(mockTasks);
  //   });
  // });
});
