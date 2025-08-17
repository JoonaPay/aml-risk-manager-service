import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('JoonaPay AML Risk Manager API')
    .setDescription(
      'Anti-Money Laundering and Risk Management service for JoonaPay platform. ' +
      'Handles risk assessment, transaction monitoring, suspicious activity detection, ' +
      'and ML-based risk scoring with real-time alert generation.'
    )
    .setVersion('1.0.0')
    .setContact('JoonaPay Development Team', 'https://joonapay.com', 'dev@joonapay.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Risk Profiles', 'Customer and entity risk profile management')
    .addTag('Risk Assessment', 'Transaction and behavioral risk assessment')
    .addTag('Alerts', 'AML alerts and suspicious activity reporting')
    .addTag('ML Scoring', 'Machine learning-based risk scoring')
    .addTag('Transaction Monitoring', 'Real-time transaction monitoring and analysis')
    .addTag('Reporting', 'AML compliance reporting and analytics')
    .addTag('Health', 'Service health and monitoring endpoints')
    .addTag('Metrics', 'Prometheus metrics and performance monitoring')
    .addServer('http://localhost:3004', 'Development server')
    .addServer('https://aml.joonapay.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('PORT') || process.env.PORT || 3004;
  
  await app.listen(port);
  
  logger.log(`🚀 JoonaPay AML Risk Manager is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
  logger.log(`🔍 Health check available at: http://localhost:${port}/health`);
  logger.log(`📊 Metrics available at: http://localhost:${port}/metrics`);
}

bootstrap();
