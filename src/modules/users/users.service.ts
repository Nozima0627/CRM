import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';
import { UpdateAdminDto } from './dto/update.admin.dto';

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

    async updateAdmin(id: number, payload: UpdateAdminDto) {
        const user = await this.prisma.user.findFirst({
          where: { id }
        });
    
        if (!user) {
          throw new NotFoundException('user not found by this id');
        }
    
    
        await this.prisma.user.update({
          where: { id },
          data: {
            first_name: payload.first_name ?? user.first_name,
            last_name: payload.last_name ?? user.last_name,
            phone: payload.phone ?? user.phone,
            email: payload.email ?? user.email,
            password: user.password,
            address: payload.address ?? user.address,
          }
        })
    
        return {
            success: true,
            message: "Admin info is updated"
        }
      }
    
      async deleteAdmin(id: number){
        const user = await this.prisma.user.findFirst({
            where: {id}
        })
    
        if(!user){
            throw new NotFoundException("user not found with this ID")
        }
    
        await this.prisma.user.update({
            where:{ id},
            data:{
                status: Status.inactive
            }
        })
    
        return {
            success: true,
            message: "Admin is deleted"
        }
      }
    
}
