import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FilterDto{
    @ApiPropertyOptional()
    @IsOptional()
    groupName?: string

    @ApiPropertyOptional()
    @IsOptional()
    maxStudent?: number
}