import { BaseEntity } from 'src/common/entities/base.entity';
import { EntityName } from 'src/common/enums/entityName.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';

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
  usage: 0;
  @Column()
  supplierId: number;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  created_at:Date
}
