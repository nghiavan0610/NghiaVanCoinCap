import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UserEntity implements User {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({ required: false, nullable: true })
    @IsEmail()
    email: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Transform((value) => value.toString())
    @IsPhoneNumber('US')
    phone: string | null;

    @ApiProperty({ enum: Role, default: 'User' })
    @IsEnum(Role)
    role: Role;

    @ApiProperty({ required: false, nullable: true })
    @IsDate()
    birthday: Date | null;

    @ApiProperty({ enum: Gender, default: 'None' })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({ required: false, nullable: true })
    about: string | null;

    @ApiProperty({ required: false, nullable: true })
    avatar: string | null;

    @ApiProperty({ required: false, nullable: true })
    cash: number | null;

    @ApiProperty({ required: false, nullable: true })
    refreshToken: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
