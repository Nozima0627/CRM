import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService

    ){}

    async userLogin(payload: LoginDto){
        const existUser = await this.prisma.user.findUnique({
            where: {phone: payload.phone}
        })

        if(!existUser) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existUser.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({id: existUser.id, email: existUser.email, role: existUser.role })
        }
    }

    async teacherLogin(payload: LoginDto){
        const existTeacher = await this.prisma.teacher.findUnique({
            where: {phone: payload.phone}
        })

        if(!existTeacher) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existTeacher.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({id: existTeacher.id, email: existTeacher.email, role: Role.TEACHER })
        }
    }

    async studentLogin(payload: LoginDto){
        const existStudent = await this.prisma.student.findUnique({
            where: {phone: payload.phone}
        })

        if(!existStudent) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existStudent.password)){
            throw new BadRequestException("Phone or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({id: existStudent.id, email: existStudent.email, role: Role.STUDENT })
        }
    }
}
