import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ required: false, nullable: true })
    email?: string | null;

    @ApiProperty({ enum: Gender, default: 'None' })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;
}
