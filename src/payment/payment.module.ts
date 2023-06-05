import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import Stripe from 'stripe';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, Stripe],
})
export class PaymentModule {}
