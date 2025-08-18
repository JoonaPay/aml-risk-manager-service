export interface RiskassessmentEntityProps {
  id?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  // Add your domain properties here
  // Example: name: string;
}

export class RiskassessmentEntity {
  public readonly id?: string;
  public readonly isActive?: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date;
  // Add your domain properties here
  // Example: public readonly name: string;

  constructor(props: RiskassessmentEntityProps) {
    Object.assign(this, props);
  }
}