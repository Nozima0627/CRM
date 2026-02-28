import { Module } from '@nestjs/common';
import { HomeworkAnswerController } from './homework-answer.controller';
import { HomeworkAnswerService } from './homework-answer.service';

@Module({
  controllers: [HomeworkAnswerController],
  providers: [HomeworkAnswerService]
})
export class HomeworkAnswerModule {}
