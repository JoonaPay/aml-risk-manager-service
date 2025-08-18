import { Body, Controller, Get, Param, Post, Delete, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateRiskassessmentCommand } from "@modules/risk-assessment/application/commands/create-risk-assessment.command";
import { CreateRiskassessmentDto } from "@modules/risk-assessment/application/dto/requests/create-risk-assessment.dto";

@Controller("risk-assessments")
export class RiskassessmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() dto: CreateRiskassessmentDto) {
    const contextId = "extracted-from-token"; // TODO: Get from auth decorator
    const command = new CreateRiskassessmentCommand(dto, contextId);
    return this.commandBus.execute(command);
  }

  @Get()
  findAll() {
    // TODO: Implement query handler
    throw new Error("Not implemented");
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    // TODO: Implement query handler
    throw new Error("Not implemented");
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    // TODO: Implement update command
    throw new Error("Not implemented");
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    // TODO: Implement delete command
    throw new Error("Not implemented");
  }
}