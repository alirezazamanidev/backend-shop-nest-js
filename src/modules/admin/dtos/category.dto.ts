import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiPropertyOptional()
  @IsString()
  slug: string;
  @ApiPropertyOptional({ type: String, format: 'binary' })
  image: Express.Multer.File;
  @ApiPropertyOptional()
  @IsNumber()
  parentId:number
}
