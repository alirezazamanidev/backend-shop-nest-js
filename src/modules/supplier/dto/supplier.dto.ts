import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, Length } from "class-validator";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class SupplierSignupDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 50)
  manager_fullname: string
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "mobile number is invalid"})
  phone: string;

  

}
