
import { Column, Entity, ManyToOne } from "typeorm";
import {OrderEntity} from "./order.entity";
import {SupplierEntity} from "src/modules/supplier/entities/supplier.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { OrderItemStatus } from "../enums/status.enum";
import { ProductEntity } from "src/modules/product/entities/product.entity";

@Entity(EntityName.OrderItem)
export class OrderItemEntity extends BaseEntity{

  @Column()
  productId: number;
  @Column()
  orderId: number;
  @Column()
  count: number;
  @Column()
  supplierId: number;
  @Column({
    type: "enum",
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;
  @ManyToOne(() => ProductEntity, (menu) => menu.orders, {onDelete: "CASCADE"})
  product: ProductEntity;
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: "CASCADE",
  })
  order: OrderEntity;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.orders, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;
}
