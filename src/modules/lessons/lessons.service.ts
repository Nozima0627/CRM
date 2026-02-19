import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
