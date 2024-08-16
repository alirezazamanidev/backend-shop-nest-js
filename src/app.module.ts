import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './configs/typeOrm.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.module';
import { S3Module } from './modules/s3/s3.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ProductModule } from './modules/product/product.module';
import { DiscountModule } from './modules/discount/discount.module';
import { BasketModule } from './modules/basket/basket.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass:TypeOrmDbConfig,
      inject:[TypeOrmDbConfig]
    }),
    AuthModule,
    CategoryModule,
    AdminModule,
    S3Module,
    SupplierModule,
    ProductModule,
    DiscountModule,
    BasketModule,
    OrderModule,
    PaymentModule,

  ],
  providers:[TypeOrmDbConfig]
})
export class AppModule {}
