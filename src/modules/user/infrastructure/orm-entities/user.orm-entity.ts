import { BaseOrmEntity } from "@core/infrastructure/base-orm-entity";
import { Column, Entity } from "typeorm";

@Entity("users")
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;
}