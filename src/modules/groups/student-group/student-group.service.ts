import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentGroupDto } from './dto/create.student.group.dto';
import { Status } from '@prisma/client';

@Injectable()
export class StudentGroupService {
    constructor(private prisma : PrismaService){}

    async getAllStudentGroup(){
        const studentGroups = await this.prisma.studentGroup.findMany({
            where:{
                status: Status.active
            }
        })

        return {
            success:true,
            data: studentGroups
        }
    }


    async createStudentGroup(payload: CreateStudentGroupDto){
        const existStudent = await this.prisma.student.findFirst({
            where:{
                id: payload.student_id,
                status: Status.active
            }
        })

        if(!existStudent){
            throw new NotFoundException("Student not found with this ID")
        }

        const existGroup = await this.prisma.group.findFirst({
            where:{
                id: payload.group_id,
                status: Status.active
            }
        })

        if(!existGroup){
            throw new NotFoundException("Group not found with this ID")
        }

        const existGroupStudent = await this.prisma.studentGroup.findFirst({
            where:{
                student_id: payload.student_id,
                group_id: payload.group_id,
                status: Status.active
            }
        })

        if(existGroupStudent){
            throw new ConflictException("Student is already in the group")
        }

        const existgroupStudentsCount = await this.prisma.studentGroup.count({
            where:{group_id: payload.group_id}
        })

        if(existgroupStudentsCount>= existGroup.max_student){
            throw new BadRequestException("Group is full")
        }



        await this.prisma.studentGroup.create({
            data: payload
        })
        return{
            success: true,
            message: "studend is added to the group"
        }
    }
}
