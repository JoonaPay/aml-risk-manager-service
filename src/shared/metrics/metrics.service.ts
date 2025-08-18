import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  async getApplicationMetrics() {
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  async getPrometheusMetrics() {
    const metrics = await this.getApplicationMetrics();
    return `
# HELP nodejs_memory_heap_used_bytes Process heap memory used
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${metrics.memory.heapUsed}

# HELP nodejs_memory_heap_total_bytes Process heap memory total
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${metrics.memory.heapTotal}

# HELP nodejs_process_uptime_seconds Node.js process uptime in seconds
# TYPE nodejs_process_uptime_seconds counter
nodejs_process_uptime_seconds ${metrics.uptime}
    `.trim();
  }
}