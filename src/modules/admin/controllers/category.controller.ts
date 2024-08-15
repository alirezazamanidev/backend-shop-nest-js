import { Body, Controller, FileTypeValidator, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { UploadFileS3 } from "src/common/interceptors/uploadFile.interceptor";
import { CreateCategoryDto } from "../dtos/category.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ContentType, SwaggerTags } from "src/common/enums/swagger.enum";

@ApiTags(SwaggerTags.AcminCategory)
@Controller('admin/category')
export class CategoryController {

  constructor(private readonly CategoryService:CategoryService){}

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(UploadFileS3('image'))
  @Post('create')
  @ApiConsumes(ContentType.Multipart)
  create(@Body() CreateCategoryDto:CreateCategoryDto,@UploadedFile(
    new ParseFilePipe({
      validators:[
        new MaxFileSizeValidator({ maxSize: 4 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'image/(png|jpg|jepg|webp)' }),
      ]
    })
  ) image:Express.Multer.File){

    return this.CategoryService.create(CreateCategoryDto,image)

  }
}
