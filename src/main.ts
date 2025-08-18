import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import session = require('express-session');

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

  // Session configuration for admin interface
  app.use(session({
    secret: 'joonapay-aml-admin-session-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 } // 1 hour
  }));

  // Body parsing for form data
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(require('express').urlencoded({ extended: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('JoonaPay AML Risk Manager API')
    .setDescription(
      'Anti-Money Laundering and Risk Management service for JoonaPay platform. ' +
      'Handles risk assessment, transaction monitoring, suspicious activity detection, ' +
      'and ML-based risk scoring with real-time alert generation.\n\n' +
      '## Key Features:\n' +
      '- **Sanctions Screening**: OpenSanctions API & OFAC SDN List (Free)\n' +
      '- **PEP Screening**: Politically Exposed Persons database (Free)\n' +
      '- **Geographic Risk**: OpenStreetMap Nominatim & RestCountries API (Free)\n' +
      '- **ML Risk Scoring**: TensorFlow.js & Hugging Face models (Free)\n' +
      '- **SAR/CTR Reporting**: Regulatory compliance with FinCEN standards\n' +
      '- **Investigation Management**: Complete case management system\n' +
      '- **Real-time Alerts**: Automated suspicious activity detection\n\n' +
      '## External Integrations (All Free & Open Source):\n' +
      '- OpenSanctions: Global sanctions and watchlist data\n' +
      '- OFAC: US Treasury sanctions database\n' +
      '- Nominatim: Geographic data and risk assessment\n' +
      '- IP Geolocation: Fraud detection and location verification\n' +
      '- Currency Risk: Exchange rate and volatility analysis'
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
    .addTag('Regulatory Reports & Compliance', 'SAR/CTR reporting and regulatory compliance')
    .addTag('Investigation Management', 'Case management and investigation workflows')
    .addTag('Compliance Screening', 'Sanctions, PEP, and adverse media screening using free APIs')
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

  // Setup AdminJS
  try {
    const { AdminJSService } = await import('./admin/admin.module');
    const adminJSService = new AdminJSService(configService);
    await adminJSService.setupAdminJS(expressApp);
  } catch (error) {
    logger.error('❌ AdminJS setup failed:', error.message);
  }

  const port = configService.get<number>('PORT') || process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`🚀 JoonaPay AML Risk Manager is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
  logger.log(`🔍 Health check available at: http://localhost:${port}/health`);
  logger.log(`📊 Metrics available at: http://localhost:${port}/metrics`);
}

bootstrap();
