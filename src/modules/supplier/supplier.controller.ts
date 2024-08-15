import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { SupplementaryInformationDto, SupplierSignupDto } from './dto/supplier.dto';
import { CheckOtpDto, SendOtpDto } from '../auth/dto/auth.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';

@ApiTags(SwaggerTags.Supplier)
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  @ApiConsumes(ContentType.UrlEncoded)
  sendOtp(@Body() SendOtpDto:SendOtpDto){
    return this.supplierService.sendOtp(SendOtpDto)

  }
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  signup(@Body() supplierDto:SupplierSignupDto){
    return this.supplierService.sginup(supplierDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  @ApiConsumes(ContentType.UrlEncoded, ContentType.Json)
  checkOtp(@Body() CheckOtpDto:CheckOtpDto){
    return this.supplierService.checkOtp(CheckOtpDto)

  }
  @Post("/supplementary-information")
  @SupplierAuth()
  @ApiConsumes(ContentType.UrlEncoded,ContentType.Json)
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }
}
