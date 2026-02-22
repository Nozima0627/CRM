import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateHomeworkDto } from './dto/create.homework.dto';
import { Role } from '@prisma/client';

@Injectable()
export class HomeworkService {
    constructor(private prisma: PrismaService){}

    async getAllHomework(){
        const homework = await this.prisma.homework.findMany()

        return {
            success: true,
            data: homework
        }
    }

    async createHomework(payload : CreateHomeworkDto, currentUser: {id: number, role: Role}, filename? : string){
        const existLesson = await this.prisma.lesson.findFirst({
            where:{id: payload.lesson_id}
        })
        
        if(!existLesson){
            throw new BadRequestException("Lesson is not found by this id")
        }
        
        await this.prisma.homework.create({
            data:{
                ...payload,
                file: filename,
                teacher_id: currentUser.role == Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != Role.TEACHER ? currentUser.id : null

            }
        })
        return {
            success: true,
            message: 'Homework is sent'
        }
    }
}
