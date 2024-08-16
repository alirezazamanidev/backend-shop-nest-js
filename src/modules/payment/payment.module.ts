import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBasketEntity } from '../basket/entities/basket.entity';
import { PaymentEntity } from './entities/payment.entity';
import { BasketService } from '../basket/basket.service';
import { AuthModule } from '../auth/auth.module';
import { BasketModule } from '../basket/basket.module';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports:[AuthModule,BasketModule,ProductModule,DiscountModule,TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
