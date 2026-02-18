import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';


@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teacherService : TeachersService){}
    
    
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
        })
        @UseGuards(AuthGuard, RoleGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @Get()
        getAllTeachers(){
            return this.teacherService.getAllTeachers()
        }
    
    
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
            description: "Bu endpointga admin va superadmin huquqi bor"
        })
        @UseGuards(AuthGuard, RoleGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @ApiConsumes('multipart/form-data')
        @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    first_name: {type: 'string'},
                    last_name: {type: 'string'},
                    email: {type: 'string'},
                    password: {type: 'string'},
                    phone: {type: 'string'},
                    photo: {type: 'string', format: 'binary'},
                    address: {type: 'string'}
                }
            }
        })
        @UseInterceptors(FileInterceptor('photo', {
            storage: diskStorage({
                destination: './src/uploads',
                filename:(req, file, cb) => {
                    const filename =Date.now()+ "." + file.mimetype.split("/")[1]
                    cb(null, filename)
                }
            })
        }))
        @Post('teacher')
        createTeacher(
            @Body() payload : CreateTeacherDto,
            @UploadedFile() file : Express.Multer.File
        ){
            console.log(file)
            return this.teacherService.createTeacher(payload, file.filename)
        }
}
