import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { UploadFileS3 } from 'src/common/interceptors/uploadFile.interceptor';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';

@ApiTags(SwaggerTags.Product)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(UploadFileS3('photo'))
  @Post('create')
  @SupplierAuth()
  @ApiConsumes(ContentType.Multipart)
  create(@Body() createProductDto: CreateProductDto,@UploadedFile(
    new ParseFilePipe({
      validators:[
        new MaxFileSizeValidator({ maxSize: 4 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
      ]
    })

  ) photo:Express.Multer.File) {
    return this.productService.create(createProductDto,photo);
  }
}
