import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR')
  @IsString()
  @IsNotEmpty()
  phone:string
}
