import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CashDto {
    @IsNotEmpty()
    @ApiProperty()
    amount: number;
}
