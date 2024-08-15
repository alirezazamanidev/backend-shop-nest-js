import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentType, SwaggerTags } from 'src/common/enums/swagger.enum';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';

@ApiTags(SwaggerTags.Auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/send-otp')
  @ApiConsumes(ContentType.UrlEncoded, ContentType.Json)
  sendOtp(@Body() SendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(SendOtpDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  @ApiConsumes(ContentType.UrlEncoded, ContentType.Json)
  checkOtp(@Body() CheckOtpDto:CheckOtpDto){
    return this.authService.checkOtp(CheckOtpDto)

  }
}
