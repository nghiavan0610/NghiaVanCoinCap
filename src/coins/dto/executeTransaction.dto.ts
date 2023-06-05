import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ExecuteTransactionDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsNotEmpty()
    @ApiProperty()
    coinId: string;

    @IsNotEmpty()
    @ApiProperty()
    type: string;

    @IsNotEmpty()
    @ApiProperty()
    realTimePrice: number;

    @IsNotEmpty()
    @ApiProperty()
    amount: number;
}
