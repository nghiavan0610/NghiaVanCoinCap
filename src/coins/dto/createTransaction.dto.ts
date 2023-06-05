import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsNotEmpty()
    @ApiProperty()
    amount: number;
}
