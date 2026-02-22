import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAdminDto {
    @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  first_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMobilePhone('uz-UZ')
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address: string;
}
