import { Module } from '@nestjs/common';
import { StudentGroupController } from './student-group.controller';
import { StudentGroupService } from './student-group.service';

@Module({
  controllers: [StudentGroupController],
  providers: [StudentGroupService]
})
export class StudentGroupModule {}
