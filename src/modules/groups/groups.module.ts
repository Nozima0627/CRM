import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { StudentGroupModule } from './student-group/student-group.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [StudentGroupModule]
})
export class GroupsModule {}
