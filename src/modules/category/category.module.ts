import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryImageEntity } from './entities/category-image.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CategoryEntity,CategoryImageEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports:[TypeOrmModule]
})
export class CategoryModule {}
