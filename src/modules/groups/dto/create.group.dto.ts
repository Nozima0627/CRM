import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}


export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  course_id: number;

  @ApiProperty()
  @IsNumber()
  teacher_id: number;

  @ApiProperty()
  @IsNumber()
  room_id: number;

  @ApiProperty({ example: '2000-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    example: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    enum: WeekDay,
    isArray: true
  })
  @IsArray()
  @IsEnum(WeekDay, {each: true})
  week_day: WeekDay[];

  @ApiProperty({example: '8:00'})
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsNumber()
  max_student: number;
}
