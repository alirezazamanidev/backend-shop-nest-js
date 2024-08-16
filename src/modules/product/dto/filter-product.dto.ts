import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterProductDTo {

  @ApiPropertyOptional()
  search:string

}
