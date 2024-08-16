import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIdentityCard, IsMobilePhone, Length } from 'class-validator';

export class SupplierSignupDto {
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 50)
  manager_fullname: string;
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile number is invalid' })
  phone: string;
}
export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}
