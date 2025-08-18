import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity('aml_alerts')
export class AmlAlert extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entityId: string;

  @Column()
  alertType: string;

  @Column()
  riskLevel: string;

  @Column('text')
  description: string;

  @Column({ default: 'open' })
  status: string;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}