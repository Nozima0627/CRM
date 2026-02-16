import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Post('admin')
    creadeAdmin(@Body() payload: CreateAdminDto){
        return this.userService.createAdmin(payload);
    }
}
