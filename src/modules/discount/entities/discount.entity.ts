import { BaseEntity } from 'src/common/entities/base.entity';
import { EntityName } from 'src/common/enums/entityName.enum';
import { UserBasketEntity } from 'src/modules/basket/entities/basket.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

@Entity(EntityName.Discount)
export class DiscountEntity extends BaseEntity {
  @Column()
  code: string;
  @Column({ type: 'numeric', nullable: true })
  percent: number;
  @Column({ type: 'numeric', nullable: true })
  amount: number;
  @Column({ nullable: true })
  expires_in: Date;
  @Column({ nullable: true })
  limit: number;
  @Column({ nullable: true, default: 0 })
  usage: number;
  @Column({nullable:true})
  supplierId: number;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  created_at:Date
  @OneToMany(()=>UserBasketEntity,basket=>basket.discount)
  baskets:UserBasketEntity[]
}
