import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBasketEntity } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { AddToBasketDTo } from './dto/basket.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ProductService } from '../product/product.service';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(UserBasketEntity)
    private readonly basketRepository: Repository<UserBasketEntity>,
    @Inject(REQUEST) private request: Request,
    private productService: ProductService,
  ) {}
  async addToBasket(basketDto: AddToBasketDTo) {
    let { productId } = basketDto;
    let { id:userId } = this.request.user;
    await this.productService.getOneById(productId);
    let basketItem=await this.basketRepository.findOne({where:{
      userId,
      productId
    }});
    if(basketItem){
      basketItem.count+=1;
    }else{
      basketItem = this.basketRepository.create({
        productId,
        userId,
        count: 1,
      });
    }
    await this.basketRepository.save(basketItem);

    return {
      message:PublicMessage.AddToBasket
    }
  }

 async removeFromBasket(productId:number){
  const {id:userId}=this.request.user;
  await this.productService.getOneById(productId);
  let basketItem=await this.basketRepository.findOne({where:{
    userId,
    productId
  }});
  if(!basketItem) throw new NotFoundException(NotFoundMessage.Basket);
  if(basketItem.count<=1){
    await this.basketRepository.delete({id:basketItem.id});
  }else{
    basketItem.count-=1
    await this.basketRepository.save(basketItem);
  }
  return {
    message:PublicMessage.RemoveFromBasket
  }
 }

  async getOneByProductId(id: number) {}
}
