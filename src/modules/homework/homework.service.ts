import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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
    
    async getOwnHomework(lessonId: number, currentUser: {id:number}){
        const myLessons = await this.prisma.homework.findMany({
            where:{
                lesson_id: lessonId
            },
            select:{
                id: true,
                title: true,
                file: true,
                created_at: true,
                updated_at: true,
                teachers:{
                    select:{
                        id: true,
                        last_name: true,
                        first_name: true,
                        phone: true,
                        photo: true
                    }
                },
                users:{
                    select:{
                        id: true,
                        last_name: true,
                        first_name: true,
                        phone: true,
                        photo: true
                    }
                }
            }
        })
        const homeworkFormatted = myLessons.map(el => {
                if(!el.teachers){
                    return {
                        id: true,
                        title: el.title,
                        file: el.file,
                        created_at: el.created_at,
                        updated_at: el.updated_at,
                        user: el.users
                    }
                } else{
                    return {
                        id: true,
                        title: el.title,
                        file: el.file,
                        created_at: el.created_at,
                        updated_at: el.updated_at,
                        teacher: el.teachers
                    }
                }
            })

        return {
            success: true,
            data: homeworkFormatted
        }
    }

    async createHomework(payload : CreateHomeworkDto, currentUser: {id: number, role: Role}, filename? : string){
        const existLesson = await this.prisma.lesson.findFirst({
            where:{id: payload.lesson_id},
            select:{
                groups:{
                    select:{
                        teacher_id: true
                    }
                }
            }
        })
        
        if(!existLesson){
            throw new BadRequestException("Lesson is not found by this id")
        }
        if(currentUser.role == Role.TEACHER && existLesson?.groups.teacher_id != currentUser.id){
            throw new ForbiddenException("It is not your lesson")
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
