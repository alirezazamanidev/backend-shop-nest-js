import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR')
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR')
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  @Length(5, 5)
  @IsString()
  code: string;
}
