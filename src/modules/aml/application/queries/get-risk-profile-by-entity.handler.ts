import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetRiskProfileByEntityQuery {
  constructor(
    public readonly id: string,
  ) {}
}

@QueryHandler(GetRiskProfileByEntityQuery)
export class GetRiskProfileByEntityHandler implements IQueryHandler<GetRiskProfileByEntityQuery> {
  constructor() {}

  async execute(query: GetRiskProfileByEntityQuery): Promise<any> {
    const { id } = query;
    // Add your query logic here
    return null;
  }
}