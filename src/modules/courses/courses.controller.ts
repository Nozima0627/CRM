import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { CreateCourseDto } from './dto/create.course.dto';


@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService){}
    
    
    
        @ApiOperation({
            summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
        })
        @UseGuards(AuthGuard, RoleGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @Get('all')
        getAllCourses(){
            return this.courseService.getAllCourses()
        }
    
    
        @ApiOperation({
            summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
        })
        @UseGuards(AuthGuard, RoleGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @Post()
        createCourse(@Body() payload: CreateCourseDto){
            return this.courseService.createCourse(payload)
        }
}
