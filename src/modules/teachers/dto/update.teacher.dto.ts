import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsMobilePhone, IsOptional, IsString } from "class-validator"

export class updateTeacherDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    first_name: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    last_name: string


    @ApiPropertyOptional()
    @IsOptional()
    @IsMobilePhone()
    phone: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address: string
}