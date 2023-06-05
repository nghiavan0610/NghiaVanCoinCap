import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CredentialDto } from './credential.dto';

export class RegistrationDto extends CredentialDto {
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
