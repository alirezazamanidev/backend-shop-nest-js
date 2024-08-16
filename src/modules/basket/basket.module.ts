import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBasketEntity } from './entities/basket.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports:[TypeOrmModule.forFeature([UserBasketEntity]),DiscountModule,ProductModule,AuthModule],

  controllers: [BasketController],
  providers: [BasketService],
  exports:[BasketService]
})
export class BasketModule {}
