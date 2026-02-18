import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @ApiBearerAuth()
    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get('admin/all')
    getAllAdmins(){
        return this.userService.getAllAdmins()
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Post('admin')
    creadeAdmin(@Body() payload: CreateAdminDto){
        return this.userService.createAdmin(payload);
    }
}
