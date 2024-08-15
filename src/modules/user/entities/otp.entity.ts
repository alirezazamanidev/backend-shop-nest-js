import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, CreateDateColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

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
