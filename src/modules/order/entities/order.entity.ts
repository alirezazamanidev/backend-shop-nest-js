import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { OrderItemEntity } from "./order-items.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";
import { EntityName } from "src/common/enums/entityName.enum";

@Entity(EntityName.Order)
export class OrderEntity extends BaseEntity {
  @Column()
  userId:number
  @Column()
  payment_amount: number;
  @Column()
  discount_amount: number;
  @Column()
  total_amount: number;
  @Column({type: "enum", enum: OrderStatus, default: OrderStatus.Pending})
  status: string;
  @Column({nullable: true})
  description: string;
  @ManyToOne(() => UserEntity, (user) => user.orders, {onDelete: "CASCADE"})
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];
  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
}
