import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, OneToOne } from "typeorm";
import { SupplierEntity } from "./supplier.entity";
import { EntityName } from "src/common/enums/entityName.enum";


@Entity(EntityName.SupplierOtp)
export class SupplierOtpEntity extends BaseEntity{
  @Column()
  code: string;
  @Column()
  expiresIn: Date;
  @Column()
  supplierId:number
  @OneToOne(()=>SupplierEntity,supplier=>supplier.otp,{onDelete:'CASCADE'})
  supplier:SupplierOtpEntity
  @CreateDateColumn()
  created_At:Date
}
