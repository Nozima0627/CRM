import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateRoomDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name: string
}