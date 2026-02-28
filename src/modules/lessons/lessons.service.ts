import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService){}

    async getAllLessons(){
        const lessons = await this.prisma.lesson.findMany({
            where:{
                status: Status.active
            }
        })
        return {
            success: true,
            data: lessons
        }
    }

    async getMyGroupLessons(groupdId : number, currentUser : { id: number}){
        const existGroup = await this.prisma.group.findFirst({
            where:{
                id: groupdId,
                status: Status.active
            }
        })

        if(!existGroup){
            throw new NotFoundException("Group is not found by this ID")
        }

        const existStudentGroup = await this.prisma.studentGroup.findFirst({
            where:{
                group_id: groupdId,
                student_id: currentUser.id,
                status: Status.active
            }
        })

        if(!existStudentGroup){
            throw new BadRequestException("Student is not in this group")
        }

        const groupLessons = await this.prisma.lesson.findMany({
            where:{
                group_id: groupdId,
                status: Status.active
            },
            select:{
                id: true,
                theme: true,
                description: true,
                created_at: true
            }
        })

        return {
            success: true,
            data: groupLessons
        }
    }

    async createLesson(payload: CreateLessonDto, currentUser : {id: number, role: Role}){
        const existGroup = await this.prisma.group.findFirst({
            where:{
                id: payload.group_id,
                status: Status.active
            }
        })

        if(!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        if(currentUser.role == Role.TEACHER && existGroup.teacher_id !=currentUser.id){
            throw new ForbiddenException("It is not your group")
        }


        const lesson = await this.prisma.lesson.create({
            data:{
                ...payload,
                teacher_id: currentUser.role == Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != Role.TEACHER ? currentUser.id : null
            }
        })

        return {
            success: true,
            message: "Lesson created"
        }
    }
}
