
import { BaseEntity } from "src/common/entities/base.entity"
import { EntityName } from "src/common/enums/entityName.enum";
import { DiscountEntity } from "src/modules/discount/entities/discount.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
@Entity(EntityName.UserBasket)
export class UserBasketEntity extends BaseEntity {

  @Column({nullable:true})
  productId:number
  @Column()
  userId:number
  @Column({nullable:true})
  count:number
  @Column({nullable: true})
  discountId: number;
  @ManyToOne(() => ProductEntity, (product) => product.baskets, {onDelete: "CASCADE"})
  product:ProductEntity;
  @ManyToOne(() => UserEntity, (user) => user.basket, {onDelete: "CASCADE"})
  user: UserEntity;
  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: "CASCADE",
  })
  discount: DiscountEntity;

}
