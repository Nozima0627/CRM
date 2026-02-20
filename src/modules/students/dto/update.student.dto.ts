import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsMobilePhone, IsOptional, IsString } from "class-validator"

export class UpdateStudentDto{
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
    @IsDateString()
    birth_date: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address: string

}