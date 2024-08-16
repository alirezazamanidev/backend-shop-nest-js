import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from 'src/common/enums/swagger.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags(SwaggerTags.Payment)
@Controller('payment')
@Auth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @HttpCode(HttpStatus.OK)
  @Post()
  gatewayUrl() {
    return this.paymentService.gatewayUrl();
  }
}
