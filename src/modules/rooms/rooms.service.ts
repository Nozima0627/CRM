import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateRoomDto } from './dto/create.room.dto';
import { Status } from '@prisma/client';
import { UpdateRoomDto } from './dto/update.room.dto';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService){}

    async getAllRooms(){
        const rooms = await this.prisma.room.findMany({
            where:{status:Status.active}
        })

        return{
            success:true,
            data:rooms
        }
    }

    async getAllArchivedRooms(){
        const rooms = await this.prisma.room.findMany({
            where:{status:Status.inactive}
        })

        return{
            success:true,
            data:rooms
        }
    }

    async createRoom(payload: CreateRoomDto){

        const existRoom = await this.prisma.room.findUnique({
            where:{name:payload.name}
        })

        if(existRoom) throw new ConflictException("This room is already exist")

        await this.prisma.room.create({
            data: payload
        })
        
        return {
            success: true,
            message:"Room is created"
        }
    }

    async updateRoom(payload: UpdateRoomDto, id: number){
        const room = await this.prisma.room.findFirst({
            where: { id }
        })

        if(!room) {
            throw new NotFoundException("Room is not found with this ID")
        }

        await this.prisma.room.update({
            where:{ id },
            data:{
                name: payload.name ?? room.name
            }
        })

        return {
            success: true,
            message: "Room is updated"
        }
    }

    async deleteRoom(id: number){
        const room = await this.prisma.room.findFirst({
            where: { id }
        })

        if(!room) {
            throw new NotFoundException("Room is not found with this ID")
        }

        await this.prisma.room.update({
            where: { id },
            data:{
                status: Status.inactive
            }
        })

        return {
            success: true,
            message: "Room is deleted"
        }
    }


}
