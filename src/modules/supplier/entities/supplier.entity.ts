import { BaseEntity } from "src/common/entities/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, UpdateDateColumn } from "typeorm";
import { SupplierOtpEntity } from "./otp.entity";

@Entity(EntityName.Supplier)
export class SupplierEntity extends BaseEntity {

  @Column({unique:true})
  phone:string
  @Column()
  manager_fullname:string
  @Column()
  store_name:string
  @Column({unique:true,nullable:true})
  email:string
 @Column({nullable: true})
  categoryId: number;
  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;
  @Column({nullable:true})
  city:string
  @Column({nullable:true})
  otpId:number
  @OneToOne(()=>SupplierOtpEntity,supplierOtp=>supplierOtp.supplier,{onDelete:'CASCADE'})
  otp:SupplierOtpEntity
  @CreateDateColumn()
  created_at:Date
  @UpdateDateColumn()
  updated_at:Date
}
