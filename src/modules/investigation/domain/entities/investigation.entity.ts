export interface InvestigationEntityProps {
  id?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  // Add your domain properties here
  // Example: name: string;
}

export class InvestigationEntity {
  public readonly id?: string;
  public readonly isActive?: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date;
  // Add your domain properties here
  // Example: public readonly name: string;

  constructor(props: InvestigationEntityProps) {
    Object.assign(this, props);
  }
}