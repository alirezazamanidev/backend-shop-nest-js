import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from 'src/common/enums/swagger.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { PaymentDto } from './dto/payment.dto';
import { Response } from 'express';

@ApiTags(SwaggerTags.Payment)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post()
  gatewayUrl(@Body() PaymentDto: PaymentDto) {
    return this.paymentService.gatewayUrl(PaymentDto);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  async verify(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.verify(authority, status);
    res.redirect(url);
  }
}
