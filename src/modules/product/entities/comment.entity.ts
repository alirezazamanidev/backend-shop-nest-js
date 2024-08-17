import { BaseEntity } from "src/common/entities/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";
import { EntityName } from "src/common/enums/entityName.enum";

@Entity(EntityName.ProductComment)
export class ProductCommentEntity extends BaseEntity {

    @Column()
    userId:number
    @Column()
    productId:number
    @Column()
    comment:string

    @ManyToOne(()=>UserEntity,user=>user.productComments,{onDelete:'CASCADE'})
    @JoinColumn()
    user:UserEntity

    @ManyToOne(()=>ProductEntity,product=>product.comments,{onDelete:'CASCADE'})
    @JoinColumn()
    product:UserEntity
    @CreateDateColumn()
    created_at:Date

}