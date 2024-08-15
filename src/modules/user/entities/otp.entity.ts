import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, CreateDateColumn, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityName } from 'src/common/enums/entityName.enum';
@Entity(EntityName.UserOtp)
export class OtpEntity extends BaseEntity {
  @Column()
  code: string;
  @Column()
  expiresIn: Date;
  @Column()
  userId:number
  @OneToOne(()=>UserEntity,user=>user.otp,{onDelete:'CASCADE'})
  user:UserEntity
  @CreateDateColumn()
  created_dAt:Date
}
