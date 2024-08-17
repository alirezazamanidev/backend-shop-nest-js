import { BadGatewayException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { BasketType } from '../basket/types/basket.type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { OrderItemStatus, OrderStatus } from './enums/status.enum';
import { OrderItemEntity } from './entities/order-items.entity';
import { PaymentDto } from '../payment/dto/payment.dto';
import { NotFoundMessage } from 'src/common/enums/message.enum';

@Injectable({scope:Scope.REQUEST})
export class OrderService {
  constructor(

    @Inject(REQUEST) private request:Request,
    private dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async create(basket: BasketType,PaymentDto:PaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction()
    try {
      const {id:userId}=this.request.user
      const {productList, payment_amount, total_amount, total_discount_amount} =
      basket;
      let order=await queryRunner.manager.create(OrderEntity,{
        total_amount,
        userId,
        payment_amount,
        description:PaymentDto?.descreiption,
        discount_amount:total_discount_amount,
        status:OrderStatus.Pending
      });
      order=await queryRunner.manager.save(OrderEntity,order);
      let orderItems:DeepPartial<OrderItemEntity>[]=[]
      for (const item of productList) {
        orderItems.push({
          count:item.count,
          productId:item.productId,
          orderId:order.id,
          status:OrderItemStatus.Pending,
          supplierId:item.supplierId
        })
      }
      if(orderItems.length===0) throw new BadGatewayException('سبد خرید شما خالیست!');
      await queryRunner.manager.insert(OrderItemEntity,orderItems);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }

  }

  async findOneById(id:number){
    const order=await this.orderRepository.findOneBy({id});
    if(!order) throw new NotFoundException(NotFoundMessage.Order);
    return order
  }
  async save(order:OrderEntity){
   return await this.orderRepository.save(order); 
  }
}
