import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create.attendance.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';


@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendaceService : AttendanceService){}


    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get('all')
    getAllAttendance(){
        return this.attendaceService.getAllAttendance()
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Post()
    createAttendance(
        @Body() payload: CreateAttendanceDto,
        @Req() req : Request
    ){
        return this.attendaceService.createAttendance(payload, req['user'])
    }
}
