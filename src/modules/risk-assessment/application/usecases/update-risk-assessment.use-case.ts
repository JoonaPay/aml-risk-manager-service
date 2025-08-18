import { RiskassessmentEntity } from "@modules/risk-assessment/domain/entities/risk-assessment.entity";
import { RiskassessmentRepository } from "@modules/risk-assessment/infrastructure/repositories/risk-assessment.repository";
import { CreateRiskassessmentCommand } from "@modules/risk-assessment/application/commands/create-risk-assessment.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateRiskassessmentUseCase {
  constructor(private readonly repository: RiskassessmentRepository) {}

  async execute(command: CreateRiskassessmentCommand) {
    const entity = new RiskassessmentEntity(command);
    return this.repository.create(entity);
  }
}