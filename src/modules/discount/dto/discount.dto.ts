import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDiscountDto {
  @ApiProperty()
  code: string;
  @ApiPropertyOptional()
  percent: number;
  @ApiPropertyOptional()
  amount: number;
  @ApiPropertyOptional()
  expires_in: number;
  @ApiPropertyOptional()
  limit: number;
}
