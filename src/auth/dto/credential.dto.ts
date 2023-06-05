import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CredentialDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 24)
    password: string;
}
