import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBasketEntity } from './entities/basket.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { AddToBasketDTo, DiscountBasketDto } from './dto/basket.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ProductService } from '../product/product.service';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { DiscountService } from '../discount/discount.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(UserBasketEntity)
    private readonly basketRepository: Repository<UserBasketEntity>,
    @Inject(REQUEST) private request: Request,
    private productService: ProductService,
    private readonly discountService: DiscountService,
  ) {}
  async addToBasket(basketDto: AddToBasketDTo) {
    let { productId } = basketDto;
    let { id: userId } = this.request.user;
    await this.productService.getOneById(productId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.basketRepository.create({
        productId,
        userId,
        count: 1,
      });
    }
    await this.basketRepository.save(basketItem);

    return {
      message: PublicMessage.AddToBasket,
    };
  }

  async removeFromBasket(productId: number) {
    const { id: userId } = this.request.user;
    await this.productService.getOneById(productId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (!basketItem) throw new NotFoundException(NotFoundMessage.Basket);
    if (basketItem.count <= 1) {
      await this.basketRepository.delete({ id: basketItem.id });
    } else {
      basketItem.count -= 1;
      await this.basketRepository.save(basketItem);
    }
    return {
      message: PublicMessage.RemoveFromBasket,
    };
  }
  async addDiscount(DiscountBasketDto: DiscountBasketDto) {
    let { code } = DiscountBasketDto;
    const { id: userId } = this.request.user;
    const discount = await this.discountService.getOnebyCode(code);

    if (!discount.active)
      throw new BadRequestException('کد تخفیف فعال نمی باشد!');
    if (discount?.limit && discount.limit <= discount.usage)
      throw new BadRequestException('ظرفیت کد تخفیف تمام شده است');

    if (
      discount?.expires_in &&
      discount?.expires_in?.getTime() <= new Date().getTime()
    )
      throw new BadRequestException('مهلت استفاده از کد تخفیف تمام شده است!');

    const UserBasketDiscount = await this.basketRepository.findOneBy({
      discountId: discount.id,
      userId,
    });
    if (UserBasketDiscount)
      throw new BadRequestException(
        'شما قبلا ازین کد تخفیف مورد نظر استفاده کرده اید!',
      );
    if (discount.supplierId) {
      const discountOfSupplier = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (discountOfSupplier)
        throw new BadRequestException(
          'شما فقط یک بار میتواند از کد تخفیف فروشنده استفاده کنید!',
        );
      const UserBasket = await this.basketRepository.findOne({
        relations: {
          product: true,
        },
        where: {
          userId,
          product: {
            supplierId: discount.supplierId,
          },
        },
      });
      if(!UserBasket) throw new BadRequestException('شما نمی تواند از کد تخفیف مورد نظر در سبد خریدتان استفاده کنید!');
    }else if(!discount.supplierId){
      const generalDiscount=await this.basketRepository.findOne({
        relations:{
          discount:true,
        },
        where:{
          userId,
          discount:{
            id:Not(IsNull()),
            supplierId:IsNull()
          }
        }
      })
      if(generalDiscount) throw new BadRequestException('کد تخفیف قبلا استفاده کرده اید!')
    }
  await this.basketRepository.insert({
    discountId:discount.id,
    userId
  });
  return {
    message:'You added dicouunt code suuccessfully'
  }
  }
}
