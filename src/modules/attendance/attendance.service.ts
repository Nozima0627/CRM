import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAttendanceDto } from './dto/create.attendance.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService){}

    async getAllAttendance(){
        const attendances = await this.prisma.attendance.findMany()
        return {
            success: true,
            data: attendances
        }
    }

    async createAttendance(payload : CreateAttendanceDto, currentUser : {id:number, role: Role}){

        const hourToMinutes =(time: string)=>{
            const [h, m] = time.split(':').map(Number);
            return h*60+m;
        }

        const week = {
            '1': 'MONDAY',
            '2': 'TUESDAY',
            '3': 'WEDNESDAY',
            '4': 'THURSDAY',
            '5': 'FRIDAY',
            '6': 'SATURDAY',
            '0': 'SUNDAY'
        }
        
        const lessonGroup = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id
            },
            select: {
                created_at: true,
                groups:{
                    select:{
                        start_time: true,
                        start_date: true,
                        week_day: true,
                        teacher_id: true,
                        courses:{
                            select:{
                                duration_hours: true
                            }
                        },
                        studentGroups:{
                            where:{
                                student_id: payload.student_id,
                                status: Status.active
                            }
                        }
                    }
                }
            }
        })

        if(currentUser.role == Role.TEACHER && lessonGroup?.groups.teacher_id != currentUser.id){
            throw new ForbiddenException("It is not your lesson")
        }

        if(!lessonGroup?.groups.studentGroups.length){
            throw new BadRequestException("Student is not found in this group")
        }


        const week_day = lessonGroup?.groups.week_day
        const nowDate = new Date()
        const day = nowDate.getDay()
        if(!week_day?.includes(week[day])){
            throw new BadRequestException('Lesson is not started yet')
        }



        const start = hourToMinutes(lessonGroup!.groups.start_time);
        const end = start + lessonGroup!.groups.courses.duration_hours *60;

        const now = nowDate.getHours() *60 + nowDate.getMinutes()

        if(!(lessonGroup.created_at.getTime() < Date.now()) && start>now){
            throw new BadRequestException("Lesson is not started yet")
        }


        if(!(start<now && end>now) && currentUser.role == Role.TEACHER){
            throw new BadRequestException("You can not check attendance out of the lesson")
        }


        
        
        await this.prisma.attendance.create({
            data:{
                ...payload,
                teacher_id: currentUser.role == Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != Role.TEACHER ? currentUser.id : null
            }
        })

        return {
            success: true,
            message: "Attendance recorded"
        }
    }
}
