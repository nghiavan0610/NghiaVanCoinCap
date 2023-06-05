import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

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

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    phone?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsDate()
    birthday?: Date | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    about?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    avatar?: string | null;
}
