import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class AddToBasketDTo {

  @ApiProperty()
  @IsNumber()
  productId:number
}
export class DiscountBasketDto {
  @ApiProperty()
  code:string
}
