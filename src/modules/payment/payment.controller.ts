import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from 'src/common/enums/swagger.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { PaymentDto } from './dto/payment.dto';

@ApiTags(SwaggerTags.Payment)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post()
  gatewayUrl(@Body() PaymentDto:PaymentDto) {
    return this.paymentService.gatewayUrl(PaymentDto);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  verify(
    @Query() query:any
    // @Query("Authority") authority: string,
    // @Query("Status") status: string,
  ){
    // return this.paymentService.verify(authority,status);
    return query
  }
}
