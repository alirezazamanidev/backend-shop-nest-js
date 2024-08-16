import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';

@Injectable({scope:Scope.REQUEST})
export class PaymentService {

  constructor(@Inject(REQUEST) private request:Request,private basketService:BasketService){}

  async gatewayUrl(){
    const {id:userId}=this.request.user
    const basket=await this.basketService.getBasket();
    return basket
  }
}
