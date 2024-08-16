import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { AddToBasketDTo, DiscountBasketDto } from './dto/basket.dto';

@ApiTags(SwaggerTags.UserBasket)
@Auth()
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @HttpCode(HttpStatus.OK)
  @Post('add')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  addToBasket(@Body() basketDto:AddToBasketDTo){
    return this.basketService.addToBasket(basketDto)

  }
  @HttpCode(HttpStatus.OK)
  @Delete('remove/:productId')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  removeFromBasket(@Param('productId',ParseIntPipe) productId:number){
    return this.basketService.removeFromBasket(productId)
  }
  @HttpCode(HttpStatus.OK)
  @Post('discount')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  addDiscount(@Body() DiscountBasketDto:DiscountBasketDto){
    return this.basketService.addDiscount(DiscountBasketDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-baskets')
  getBasket(){
    return this.basketService.getBasket();
  }
}
