import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsNumber } from "class-validator"

export class CreateAttendanceDto {
    @ApiPropertyOptional()
    @IsNumber()
    lesson_id: number

    @ApiPropertyOptional()
    @IsNumber()
    student_id : number

    @ApiPropertyOptional()
    @IsBoolean()
    isPresent : boolean
}