import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { EntityName } from "src/common/enums/entityName.enum";

@Entity(EntityName.ProductPhoto)
export class ProductPhotoEntity extends BaseEntity {
    @Column({ nullable: false, type: String })
    fieldname: string
  
    @Column({ nullable: false, type: String })
    path: string
    @Column({nullable:false})
    key:string
    @Column({ nullable: false, type: Number })
    size: number
  
    @Column({ nullable: false, type: String })
    originalname: string
  
    @Column({ nullable: false, type: String })
    mimetype: string
  
  
    @OneToOne(()=>ProductEntity , (product)=>product.photo,{onDelete:'CASCADE'})
    product:ProductEntity
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}