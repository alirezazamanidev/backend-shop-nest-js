import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import slugify from 'slugify';
import { S3Service } from '../s3/s3.service';
import { PublicMessage } from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CategoryService } from '../category/category.service';

@Injectable({scope:Scope.REQUEST})
export class ProductService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository:Repository<ProductEntity>,private s3Service:S3Service,
  @Inject(REQUEST) private readonly request:Request,
  private readonly categoryService:CategoryService
  ){}
  async create(
    createProductDto: CreateProductDto,
    photo: Express.Multer.File,
  ) {

    let {id:supplierId}=this.request.supplier;
    let {title,slug,categoryId,description,price}=createProductDto

    let objectProduct:DeepPartial<ProductEntity>={title,description,supplierId,price};
    objectProduct['slug']=slug ?slug:slugify(title,{replacement:'_',lower:true});
    await this.categoryService.findOneById(categoryId);
    objectProduct['categoryId']=categoryId;
    // upload image
    let {Location,Key}=await this.s3Service.uploadFile(photo,'product/images');
    objectProduct['photo']=Location;
    objectProduct['photoKey']=Key;

    let newProduct=this.productRepository.create(objectProduct);
    await this.productRepository.save(newProduct);
    return {
      message:PublicMessage.Insert
    }

  }

}
