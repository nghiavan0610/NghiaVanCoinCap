import { PrismaService } from 'src/prisma/prisma.service';
import { CashDto } from './dto/cash.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService, private config: ConfigService, private stripe: Stripe) {
        this.stripe = new Stripe(config.get<string>('SECRET_KEY'), {
            apiVersion: '2022-11-15',
        });
    }

    async getOrders(id: string): Promise<Order[]> {
        const orders = await this.prisma.order.findMany({ where: { userId: id }, orderBy: { createdAt: 'desc' } });
        return orders;
    }

    private async createOrder(customer: any, data: any): Promise<void> {
        try {
            const userId = customer.metadata.userId;
            const amountTotal = data.amount_total / 100;
            await Promise.all([
                this.prisma.order.create({
                    data: {
                        userId,
                        customerId: data.customer,
                        paymentIntentId: data.payment_intent,
                        product: customer.metadata.product,
                        subTotal: data.amount_subtotal / 100,
                        total: amountTotal,
                        paymentStatus: data.payment_status,
                    },
                }),
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { cash: { increment: amountTotal } },
                }),
            ]);
        } catch (err) {
            throw err;
        }
    }

    async checkOut(id: string, cashDto: CashDto): Promise<string> {
        try {
            const customer = await this.stripe.customers.create({
                metadata: {
                    userId: id,
                    product: 'Pay your deposit',
                },
            });
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer: customer.id,
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Pay your deposit',
                            },
                            unit_amount: cashDto.amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${this.config.get<string>('CLIENT_URL')}`,
                cancel_url: `${this.config.get<string>('CLIENT_URL')}`,
            });

            return session.url;
        } catch (err) {
            throw err;
        }
    }

    private async createEvent(id: string): Promise<any> {
        try {
            return await this.prisma.stripeEvent.create({ data: { id } });
        } catch (err) {
            console.log(`Event error: ${err}`);
            throw new BadRequestException('This event was already processed');
        }
    }

    private constructEventFromPayload(signature: string, payload: Buffer): Stripe.Event {
        return this.stripe.webhooks.constructEvent(payload, signature, this.config.get<string>('ENDPOINT_SECRET'));
    }

    async handleEvent(signature: string, payload: Buffer): Promise<void> {
        try {
            const event = this.constructEventFromPayload(signature, payload);

            if (event.type !== 'checkout.session.completed') {
                return;
            }

            await this.createEvent(event.id);

            const data = event.data.object as Stripe.Subscription;
            const customerId: string = data.customer as string;

            const customer = await this.stripe.customers.retrieve(customerId);
            if (!customer) throw new BadRequestException(`Customer was not found ${customerId}`);

            await this.createOrder(customer, data);
        } catch (err) {
            console.log(`Error: ${err}`);
            throw err;
        }
    }
}
