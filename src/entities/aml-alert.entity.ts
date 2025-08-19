import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

export interface AlertMetadata {
  riskScore?: number;
  sourceSystem?: string;
  customerInfo?: {
    id: string;
    name: string;
    country?: string;
  };
  transactionDetails?: {
    amount?: number;
    currency?: string;
    type?: string;
  };
  matchDetails?: {
    sanctionsList?: string;
    confidenceScore?: number;
    reason?: string;
  };
  reviewNotes?: string[];
  escalationReason?: string;
  resolutionNotes?: string;
  [key: string]: any; // Allow additional properties for flexibility
}

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
  metadata: AlertMetadata;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}