import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StudentGroupService } from './student-group.service';
import { CreateStudentGroupDto } from './dto/create.student.group.dto';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';


@ApiBearerAuth()
@Controller('student-group')
export class StudentGroupController {
    constructor(private readonly studentGroupService: StudentGroupService){}

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('@all')
    getAllStudentGroup(){
        return this.studentGroupService.getAllStudentGroup()
    }



    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post()
    createStudentGroup(@Body() payload: CreateStudentGroupDto){
        return this.studentGroupService.createStudentGroup(payload)
    }
}
