import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { AddToBasketDTo } from './dto/basket.dto';

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
}
