import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { S3Service } from '../s3/s3.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports:[CategoryModule,S3Module],
  controllers:[CategoryController],
  providers:[CategoryService]
})
export class AdminModule {}
