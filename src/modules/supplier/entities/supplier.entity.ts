import { BaseEntity } from "src/common/entities/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { SupplierOtpEntity } from "./otp.entity";
import { SupplierStatus } from "../enum/status.enum";
import { ProductEntity } from "src/modules/product/entities/product.entity";

@Entity(EntityName.Supplier)
export class SupplierEntity extends BaseEntity {

  @Column({unique:true})
  phone:string
  @Column()
  manager_fullname:string
  @Column({default:SupplierStatus.Registered})
  status:string
  @Column()
  store_name:string
  @Column({unique:true,nullable:true})
  email:string

  @Column({nullable:true})
  city:string
  @Column({nullable:true})
  otpId:number
  @OneToOne(()=>SupplierOtpEntity,supplierOtp=>supplierOtp.supplier,{onDelete:'CASCADE'})
  @JoinColumn({name:"otpId"})
  otp:SupplierOtpEntity
  @Column({default:false})
  phone_verify:boolean
  @Column({unique:true,nullable:true})
  national_code:string
  @CreateDateColumn()
  created_at:Date
  @UpdateDateColumn()
  updated_at:Date
  @OneToMany(()=>ProductEntity,product=>product.supplier)
  products:ProductEntity[]
}
