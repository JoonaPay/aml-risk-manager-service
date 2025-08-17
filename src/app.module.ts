import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TerminusModule } from '@nestjs/terminus';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// AML Module imports
import { AMLModule } from './modules/aml/aml.module';

// Shared modules
import { ConfigurationModule } from './shared/config/configuration.module';
import { HealthModule } from './shared/health/health.module';
import { MetricsModule } from './shared/metrics/metrics.module';
import { KafkaModule } from './shared/kafka/kafka.module';

// ORM Entities
import {
  RiskProfileOrmEntity,
  AmlAlertOrmEntity,
  TransactionMonitoringRuleOrmEntity,
  MlModelOrmEntity,
} from './modules/aml/infrastructure/orm-entities';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'aml_risk_manager'),
        entities: [
          RiskProfileOrmEntity,
          AmlAlertOrmEntity,
          TransactionMonitoringRuleOrmEntity,
          MlModelOrmEntity,
        ],
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: configService.get('NODE_ENV') !== 'production',
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false,
        } : false,
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Metrics
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),

    // Health checks
    TerminusModule,

    // Event system
    EventEmitterModule.forRoot(),

    // Shared modules
    ConfigurationModule,
    HealthModule,
    MetricsModule,
    KafkaModule,

    // Business modules
    AMLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
