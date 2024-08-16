import { ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinPalService } from '../http/zarinpal.service';
import { PaymentDataDto, PaymentDto } from './dto/payment.dto';
import { OrderService } from '../order/order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private basketService: BasketService,
    private zarinpalService: ZarinPalService,
    private orderService: OrderService,
    @InjectRepository(PaymentEntity)
    private paymentReposiotry: Repository<PaymentEntity>,
  ) {}

  async gatewayUrl(paymentDto: PaymentDto) {
    const { id: userId } = this.request.user;
    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket, paymentDto);
    console.log(basket.payment_amount);

    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      userId,
      status: basket.payment_amount === 0,
      invoice_number: new Date().getTime().toString(),
    });
    if(!payment.status){
      const {authority,code,gateWayUrl}= await this.zarinpalService.sendRequest({
        amount: basket.payment_amount,
        description:'payment',
      });
      payment.authority=authority;
      await this.paymentReposiotry.save(payment);
      return {
        gateWayUrl,
        code
      }
    }
    return {
      message:'پرداخت با موفقیت انجام شد'
    }

  }
  async create(paymentDto: PaymentDataDto) {
    const { amount, invoice_number, orderId, status, userId } = paymentDto;
    const payment = this.paymentReposiotry.create({
      amount,
      invoice_number,
      orderId,
      status,
      userId,
    });
    return await this.paymentReposiotry.save(payment);
  }

  async verify(authority:string,status:string){
    const payment=await this.paymentReposiotry.findOneBy({authority});
    if (!payment) throw new NotFoundException();
    if (payment.status) throw new ConflictException("already verified");


  }
}
