import { PartialType } from '@nestjs/mapped-types';
import { TaskStatus } from '../task-status.enum';
import { CreateTaskDto } from './create-task.dto';
import { IsIn } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
  status: TaskStatus;
}
