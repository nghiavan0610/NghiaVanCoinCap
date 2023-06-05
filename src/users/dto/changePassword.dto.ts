import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 24)
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 24)
    newPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 24)
    confirmPassword: string;
}
