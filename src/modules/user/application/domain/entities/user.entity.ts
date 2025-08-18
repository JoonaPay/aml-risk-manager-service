import { BaseDomainEntity } from "@core/domain/base-domain-entity";

export interface BaseDomainEntityProps {
  id?: string;
}

export interface UserEntityProps extends BaseDomainEntityProps {
  // Add your domain properties here
  // Example: name: string;
}

export class UserEntity extends BaseDomainEntity {
  // Add your domain properties here
  // Example: name: string;

  constructor(props: UserEntityProps) {
    super();
    Object.assign(this, props);
  }
}