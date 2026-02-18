import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService){}

    async getAllAdmins(){
        const admins = await this.prisma.user.findMany({
            where: {
                status:Status.active,
                role: Role.ADMIN
            },
            select:{
                id:true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                role: true
            }
        })

        return {
            success: true,
            data: admins
        }
    }

    async createAdmin(payload: CreateAdminDto){
        const existAdmin = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {phone: payload.phone},
                    {password: payload.password}
                ]
            }
        })
        if(existAdmin) throw new ConflictException()

        const hashPass = await bcrypt.hash(payload.password, 10)
        await this.prisma.user.create({
            data:{
                ...payload,
                role: 'ADMIN',
                password: hashPass
            }
        })

        return {
            success: true,
            message: "admin is created"
        }
    }
}
