import { BaseEntity } from 'src/common/entities/base.entity';
import { EntityName } from 'src/common/enums/entityName.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OtpEntity } from './otp.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true })
  phone: string;
  @Column({ default: false })
  phone_verify: boolean;
  @Column({ unique: true, nullable: true })
  email: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => OtpEntity, (otp) => otp.user, { onDelete: 'CASCADE' })
  @JoinColumn({name:'otpId'})
  otp: OtpEntity;
}
