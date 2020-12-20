import { Task } from './entities/task.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task, data: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(
    @Query(ValidationPipe) filterTaskDto?: FilterTaskDto,
    @GetUser() user?: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks with filters: ${JSON.stringify(filterTaskDto)}`,
    );
    return this.tasksService.findAll(filterTaskDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Patch(':id/status')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.tasksService.updateTask(id, status, user);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<string> {
    return this.tasksService.deleteTask(id, user);
  }
}
