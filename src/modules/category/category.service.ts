import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundMessage } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

  ) {}
  async findOneById(id:number) {
    const cate=await this.categoryRepository.findOneBy({id});
    if(!cate) throw new NotFoundException(NotFoundMessage.Category);
    return cate
  }

}
