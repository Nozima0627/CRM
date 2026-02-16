import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService

    ){}

    async login(payload: LoginDto){
        const existUser = await this.prisma.user.findUnique({
            where: {phone: payload.phone}
        })

        if(!existUser) throw new NotFoundException("Phone or password is wrong");
        if(!await bcrypt.compare(payload.password, existUser.password)){
            throw new BadRequestException("Email or password is wrong");
        }

        return{
            succes: true,
            message: "You are logged in",
            token: this.jwtService.sign({id: existUser.id, email: existUser.email, role: existUser.role })
        }
    }
}
