import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { CreateDiscountDto } from './dto/discount.dto';

@ApiTags(SwaggerTags.DisCount)
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/create')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  create(@Body() discountDto:CreateDiscountDto){
    return this.discountService.create(discountDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('list')
  findAll(){
    return this.discountService.findAll()
  }
}
