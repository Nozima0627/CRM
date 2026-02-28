import { Module } from '@nestjs/common';
import { HomeworkResultController } from './homework-result.controller';
import { HomeworkResultService } from './homework-result.service';

@Module({
  controllers: [HomeworkResultController],
  providers: [HomeworkResultService]
})
export class HomeworkResultModule {}
