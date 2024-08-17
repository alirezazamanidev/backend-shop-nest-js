import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { S3Module } from '../s3/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { SupplierModule } from '../supplier/supplier.module';
import { ProductPhotoEntity } from './entities/product-photo.entity';

@Module({
  imports:[S3Module,SupplierModule,TypeOrmModule.forFeature([ProductEntity,ProductPhotoEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
