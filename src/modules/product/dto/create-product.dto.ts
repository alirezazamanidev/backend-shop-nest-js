import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title:string
  @ApiPropertyOptional()
  @IsString()
  slug:string
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description:string
  @ApiProperty({ type: String, format: 'binary' })
  photo:Express.Multer.File
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price:number
  @ApiProperty()
  @IsNumber()
  categoryId:number

}
