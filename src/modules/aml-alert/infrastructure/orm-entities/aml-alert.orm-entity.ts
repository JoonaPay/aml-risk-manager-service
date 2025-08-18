import { BaseOrmEntity } from "@core/infrastructure/base-orm-entity";
import { Column, Entity } from "typeorm";

@Entity("aml_alerts")
export class AmlAlertOrmEntity extends BaseOrmEntity {
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
}