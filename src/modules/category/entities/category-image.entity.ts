import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { EntityName } from "src/common/enums/entityName.enum";

@Entity(EntityName.CategoryImage)
export class CategoryImageEntity extends BaseEntity{
  @Column({ nullable: false, type: String })
  fieldname: string

  @Column({ nullable: false, type: String })
  path: string
  @Column()
  key:string
  @Column({ nullable: false, type: Number })
  size: number

  @Column({ nullable: false, type: String })
  originalname: string

  @Column({ nullable: false, type: String })
  mimetype: string


  @OneToOne(()=>CategoryEntity , (category)=>category.image)
  category:CategoryEntity

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
