import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
    @IsString()
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
    @ApiProperty({ required: false })
    email?: string | null;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;
}
