import { BaseEntity } from "src/common/entities/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { UserBasketEntity } from "src/modules/basket/entities/basket.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { OrderItemEntity } from "src/modules/order/entities/order-items.entity";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { ProductPhotoEntity } from "./product-photo.entity";
import { ProductCommentEntity } from "./comment.entity";

@Entity(EntityName.Product)
export class ProductEntity extends BaseEntity {

  @Column({unique:true})
  title:string
  @Column({unique:true})
  slug:string
  @Column({type:'text'})
  description:string
  @Column({nullable:true})
  photoId:number
  @Column({type:'numeric'})
  price:number
  @Column({type:'numeric',default:0})
  discount:number;
  @Column({default:false})
  is_Active_discount:boolean
  @Column({type:'numeric',default:0})
  score:number
  @Column()
  supplierId:number
  @ManyToOne(()=>SupplierEntity,supplier=>supplier.products,{onDelete:'CASCADE'})
  @JoinColumn({name:'supplierId'})
  supplier:SupplierEntity
  @Column()
  categoryId:number
  @ManyToOne(()=>CategoryEntity,{onDelete:'SET NULL'})
  @JoinColumn({name:'categoryId'})
  category:CategoryEntity
  @OneToOne(()=>ProductPhotoEntity,photo=>photo.product,{onDelete:'CASCADE'})
  @JoinColumn()
  photo:ProductPhotoEntity
  @CreateDateColumn()
  created_at:Date

  @UpdateDateColumn()
  updated_at:Date
  @OneToMany(()=>UserBasketEntity,basket=>basket.product)
  baskets:UserBasketEntity[]
  @OneToMany(()=>OrderItemEntity,order=>order.product)
  orders:OrderItemEntity[]
  @OneToMany(()=>ProductCommentEntity,comment=>comment.product)
  comments:ProductCommentEntity[]

}
