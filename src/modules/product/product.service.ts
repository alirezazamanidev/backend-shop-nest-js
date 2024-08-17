import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import slugify from 'slugify';
import { S3Service } from '../s3/s3.service';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CategoryService } from '../category/category.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterProductDTo } from './dto/filter-product.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utility/pagination.util';
import { EntityName } from 'src/common/enums/entityName.enum';
import { ProductPhotoEntity } from './entities/product-photo.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductPhotoEntity)
    private readonly productPhotoRepository: Repository<ProductPhotoEntity>,
    private s3Service: S3Service,
    @Inject(REQUEST) private readonly request: Request,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto, photo: Express.Multer.File) {
    let { id: supplierId } = this.request.supplier;
    let { title, discount, slug, categoryId, description, price } =
      createProductDto;

    // Validate category exists
    await this.categoryService.findOneById(categoryId);

    // Prepare product data
    let objectProduct: DeepPartial<ProductEntity> = {
      title,
      discount,
      description,
      supplierId,
      price,
    };
    objectProduct['is_Active_discount'] = discount>0 ? true : false;
    objectProduct['slug'] = slug
      ? slug
      : slugify(title, { replacement: '_', lower: true });
    objectProduct['slug'] = await this.checkExistBySlug(objectProduct['slug']);
    objectProduct['categoryId'] = categoryId;
    try {
      // Create product entity
      let newProduct = this.productRepository.create(objectProduct);
      // Save the product data
      await this.productRepository.save(newProduct);
      // create new photo

      // If successful, upload the image
      let { Location, Key } = await this.s3Service.uploadFile(
        photo,
        'product/images',
      );
    // save photo product 
      let newPhoto = await this.productPhotoRepository.create({
        fieldname: photo.fieldname,
        size: photo.size,
        mimetype: photo.mimetype,
        originalname: photo.originalname,
        key: Key,
        path: Location,
      });
      newPhoto=await this.productPhotoRepository.save(newPhoto);
      newProduct.photoId=newPhoto.id;
      // Update product with photo details
      await this.productRepository.save(newProduct);

      return {
        message: PublicMessage.Insert,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async checkExistBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      select: { id: true },
    });
    if (product) throw new ConflictException(ConflictMessage.Slug);
    return slug;
  }
  async filterProducts(
    paginationDto: PaginationDto,
    FilterProductDTo: FilterProductDTo,
  ) {
    let { page, limit, skip } = paginationSolver(paginationDto);
    let { search } = FilterProductDTo;
    let where = '';
    let parameters: any = {};
    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search}%`;
      where += 'CONCAT(product.title,product.description) LIKE :search';
      parameters.search = search;
    }
    const [products, count] = await this.productRepository
      .createQueryBuilder(EntityName.Product)
      .leftJoinAndSelect('product.category', 'category')

      .where(where, parameters)
      .take(page)
      .skip(skip)
      .getManyAndCount();

    return {
      products,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async getOneById(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(NotFoundMessage.Product);
    return product;
  }
}
