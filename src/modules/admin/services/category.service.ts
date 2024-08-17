import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/category.dto';
import { CategoryImageEntity } from 'src/modules/category/entities/category-image.entity';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import slugify from 'slugify';
import { S3Service } from 'src/modules/s3/s3.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryImageEntity)
    private categoryImageRepository: Repository<CategoryImageEntity>,
    private s3Service: S3Service,
  ) {}

  async create(
    CreateCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    let { name, slug, parentId } = CreateCategoryDto;

    let objectCategory: DeepPartial<CategoryEntity> = {};

    objectCategory['name'] = name;
    objectCategory['slug'] = slug
      ? await this.checkExistBySlug(slug)
      : await this.checkExistBySlug(
          slugify(name, { replacement: '_', lower: true }),
        );

    if (parentId) {
      await this.findOneById(parentId);
      objectCategory['parentId'] = parentId;
    }
    try {
      const newCategory=this.categoryRepository.create(objectCategory);
      await this.categoryRepository.save(newCategory);
      if (image) {
        let { Location, Key } = await this.s3Service.uploadFile(
          image,
          'category/images',
        );

        let newImage = this.categoryImageRepository.create({
          fieldname: image.fieldname,
          key: Key,
          path: Location,
          originalname: image.originalname,
          mimetype: image.mimetype,
          size: image.size,
        });
        newImage = await this.categoryImageRepository.save(newImage);
        newCategory.imageId=newImage.id;
      }
      await this.categoryRepository.save(objectCategory);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      message: PublicMessage.Insert,
    };
  }
  async findOneById(id: number) {
    const cate = await this.categoryRepository.findOneBy({ id });
    if (!cate) throw new NotFoundException(NotFoundMessage.Category);
    return cate;
  }

  async checkExistBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({ where: { slug } });

    if (category) throw new ConflictException(ConflictMessage.Slug);
    return slug;
  }
}
