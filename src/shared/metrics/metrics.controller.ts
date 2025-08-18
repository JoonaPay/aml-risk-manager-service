import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  async getMetrics() {
    return this.metricsService.getApplicationMetrics();
  }

  @Get('prometheus')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus format metrics' })
  async getPrometheusMetrics() {
    return this.metricsService.getPrometheusMetrics();
  }
}