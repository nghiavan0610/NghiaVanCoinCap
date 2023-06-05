import { Body, Controller, HttpCode, HttpStatus, Post, Headers, Req, BadRequestException, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { CashDto } from './dto/cash.dto';
import { Public } from 'src/decorators/public.decorator';
import RequestWithRawBody from './interfaces/requestWithRawBody.interface';
import { OrdersPayload } from './interfaces/order.interface';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get('orders')
    @HttpCode(HttpStatus.OK)
    async getOrders(@GetCurrentUserId() id: string): Promise<OrdersPayload> {
        const orders = await this.paymentService.getOrders(id);
        return { orders };
    }

    @Post('deposit')
    @HttpCode(HttpStatus.OK)
    async checkOut(@GetCurrentUserId() id: string, @Body() depositDto: CashDto): Promise<string> {
        const url = await this.paymentService.checkOut(id, depositDto);
        return url;
    }

    @Public()
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleEvent(
        @Headers('stripe-signature') signature: string,
        @Req() request: RequestWithRawBody,
    ): Promise<void> {
        if (!signature) throw new BadRequestException('Missing stripe-signature header');

        // const event = await this.paymentService.constructEventFromPayload(signature, request.rawBody);
        return await this.paymentService.handleEvent(signature, request.rawBody);

        // if (event.type === 'checkout.session.completed') {
        //     return await this.paymentService.handleEvent(event);
        // }
    }
}
