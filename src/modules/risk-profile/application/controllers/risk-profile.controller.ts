import { Body, Controller, Get, Param, Post, Delete, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateRiskprofileCommand } from "@modules/risk-profile/application/commands/create-risk-profile.command";
import { CreateRiskprofileDto } from "@modules/risk-profile/application/dto/requests/create-risk-profile.dto";

@Controller("risk-profiles")
export class RiskprofileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() dto: CreateRiskprofileDto) {
    const contextId = "extracted-from-token"; // TODO: Get from auth decorator
    const command = new CreateRiskprofileCommand(dto, contextId);
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