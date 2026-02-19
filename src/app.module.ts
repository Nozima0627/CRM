import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: 
  [
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(),'src', 'uploads'),
        serveRoot:'/files'
      }),
    ConfigModule.forRoot({
        isGlobal: true
    }),
    AuthModule,
    UsersModule,
    TeachersModule,
    StudentsModule,
    CoursesModule,
    GroupsModule,
    RoomsModule
  ]
})
export class AppModule {}
