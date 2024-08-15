import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOtpEntity } from './entities/otp.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { TokenService } from './token.service';

@Module({
  imports:[TypeOrmModule.forFeature([SupplierEntity,SupplierOtpEntity,CategoryEntity])],
  controllers: [SupplierController],
  providers: [SupplierService,CategoryService,TokenService],
})
export class SupplierModule {}
