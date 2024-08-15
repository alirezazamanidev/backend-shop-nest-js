import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { SupplierSignupDto } from './dto/supplier.dto';

@ApiTags(SwaggerTags.Supplier)
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  signup(@Body() supplierDto:SupplierSignupDto){
    return this.supplierService.sginup(supplierDto);
  }
}
