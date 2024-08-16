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
      if (!UserBasket)
        throw new BadRequestException(
          'شما نمی تواند از کد تخفیف مورد نظر در سبد خریدتان استفاده کنید!',
        );
    } else if (!discount.supplierId) {
      const generalDiscount = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplierId: IsNull(),
          },
        },
      });
      if (generalDiscount)
        throw new BadRequestException('کد تخفیف قبلا استفاده کرده اید!');
    }
    await this.basketRepository.insert({
      discountId: discount.id,
      userId,
    });
    return {
      message: 'You added dicouunt code suuccessfully',
    };
  }
  async removeDiscount(discountDto: DiscountBasketDto) {
    const { code } = discountDto;
    const { id: userId } = this.request.user;
    const discount = await this.discountService.getOnebyCode(code);
    const basketDiscount = await this.basketRepository.findOne({
      where: {
        discountId: discount.id,
      },
    });
    if (!basketDiscount)
      throw new BadRequestException('Not found discount in basket');

    await this.basketRepository.delete({ discountId: discount.id, userId });
    return {
      message: 'You deleted discount code successfully',
    };
  }
  async getBasket() {
    const { id: userId } = this.request.user;
    const basketItems = await this.basketRepository.find({
      relations: {
        discount: true,
        product: {
          supplier: true,
        },
      },
      where: {
        userId,
      },
    });

    const products = basketItems.filter((item) => item.productId);
    const supplierDiscounts = basketItems.filter(
      (item) => item?.discount?.supplierId,
    );
    const generalDiscounts = basketItems.find(
      (item) => item?.discount?.id && !item.discount.supplierId,
    );
    let total_amount = 0;
    let payment_amount = 0;

    let tottal_dicount_amount = 0;
    let productList = [];
    for (const item of products) {
      let discount_amount = 0;
      let discount_code: string = null;
      const { product, count } = item;
      total_amount += product.price * count;
      const supplierId = product.supplierId;
      let productPrice = product.price;
      if (product.is_Active_discount && product.discount > 0) {
        discount_amount += productPrice * (product.discount / 100);
        productPrice = productPrice - productPrice * (product.discount / 100);
        console.log(discount_amount);

      }
      const discountItem = supplierDiscounts.find(
        ({ discount }) => discount.supplierId === supplierId,
      );
      if (discountItem) {
        const {
          discount: { active, amount, percent, limit, usage, code },
        } = discountItem;
        if (active) {
          if (!limit || (limit && limit > usage)) {
            discount_code = code;
            if (percent && percent > 0) {
              discount_amount += productPrice * (percent / 100);
              productPrice = productPrice - productPrice * (percent / 100);
            } else if (amount && amount > 0) {
              discount_amount += amount;
              productPrice = amount > productPrice ? 0 : productPrice - amount;
            }
          }
        }
      }
      payment_amount += productPrice;
      tottal_dicount_amount += discount_amount;
      productList.push({
        ...product,
        total_amount: product.price * count,
        discount_amount,
        payment_amount: product.price * count - discount_amount,
        discount_code,
      });
    }

    let generalDiscountDetail = {};
    if (generalDiscounts?.discount?.active) {
      const { discount } = generalDiscounts;
      if (discount?.limit && discount.limit > discount.usage) {
        let discount_amount = 0;
        if (discount.percent > 0) {

          discount_amount = payment_amount * (discount.percent / 100);
          console.log(payment_amount);

        } else if (discount.amount > 0) {
          discount_amount = discount.amount;
        }
        payment_amount =
          discount_amount > payment_amount
            ? 0
            : payment_amount - discount_amount;
        tottal_dicount_amount += discount_amount;
        generalDiscountDetail = {
          code: discount.code,
          percent: discount.percent,
          amount: discount.amount,
          discount_amount,
        };
      }
    }

    return {
      total_amount,
      payment_amount,
      tottal_dicount_amount,
      productList,
      generalDiscountDetail,
    };
  }
}
