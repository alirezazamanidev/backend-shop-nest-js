import { BaseEntity } from "src/common/entities/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { CategoryImageEntity } from "./category-image.entity";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {

  @Column({unique:true})
  name:string
  @Column({unique:true})
  slug:string
  @Column({nullable:true})
  parentId:number
  @ManyToOne(()=>CategoryEntity,cate=>cate.children,{onDelete:'CASCADE'})
  parent:CategoryEntity
  @OneToMany(()=>CategoryEntity,cate=>cate.parent)
  children:CategoryEntity[]

  @Column({nullable:true})
  imageId:number

  @OneToOne(()=>CategoryImageEntity,img=>img.category,{onDelete:'CASCADE'})
  @JoinColumn({name:'imageId'})
  image:CategoryImageEntity
  @CreateDateColumn()
  created_at:Date
  @UpdateDateColumn()
  updated_at:Date
  @OneToMany(()=>SupplierEntity,supplier=>supplier.category)
  suppliers:SupplierEntity[]

}
