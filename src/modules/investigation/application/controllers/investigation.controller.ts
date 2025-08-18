import { Body, Controller, Get, Param, Post, Delete, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateInvestigationCommand } from "@modules/investigation/application/commands/create-investigation.command";
import { CreateInvestigationDto } from "@modules/investigation/application/dto/requests/create-investigation.dto";

@Controller("investigations")
export class InvestigationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() dto: CreateInvestigationDto) {
    const contextId = "extracted-from-token"; // TODO: Get from auth decorator
    const command = new CreateInvestigationCommand(dto, contextId);
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