import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiExtraModels,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventBus } from '@nestjs/cqrs';
import { ExternalIntegrationsService } from '../services/external-integrations.service';
import { SanctionsScreenRequestedEvent, SanctionsScreenCompletedEvent } from '../../domain/events';

// DTOs with full Swagger documentation
class ScreeningSanctionsDto {
  @ApiProperty({
    description: 'Full name of the person or entity to screen',
    example: 'John Smith',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Date of birth for person screening (ISO 8601)',
    example: '1980-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'US',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Type of entity being screened',
    enum: ['person', 'company'],
    example: 'person',
    required: true,
  })
  @IsEnum(['person', 'company'])
  entityType: 'person' | 'company';
}

class ScreeningOFACDto {
  @ApiProperty({
    description: 'Name to screen against OFAC SDN list',
    example: 'ABC Corporation',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Address for enhanced matching',
    example: '123 Main St, New York, NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Identification number (passport, national ID, etc)',
    example: 'A12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  idNumber?: string;
}

class GeographicRiskDto {
  @ApiProperty({
    description: 'Country code for risk assessment',
    example: 'SY',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Full address for geocoding',
    example: '456 Park Ave, London, UK',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Geographic coordinates',
    required: false,
    type: 'object',
    properties: {
      lat: { type: 'number', example: 51.5074 },
      lng: { type: 'number', example: -0.1278 },
    },
  })
  @IsOptional()
  @IsObject()
  coordinates?: { lat: number; lng: number };
}

class TransactionDataDto {
  @ApiProperty({ description: 'Transaction amount', example: 10000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Transaction type', example: 'wire_transfer' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Transaction frequency (per month)', example: 5 })
  @IsNumber()
  frequency: number;

  @ApiProperty({ description: 'Velocity score (0-100)', example: 75 })
  @IsNumber()
  velocity: number;
}

class EntityDataDto {
  @ApiProperty({ description: 'Account age in days', example: 365 })
  @IsNumber()
  accountAge: number;

  @ApiProperty({ description: 'Total transaction count', example: 150 })
  @IsNumber()
  transactionCount: number;

  @ApiProperty({ description: 'Risk profile level', example: 'medium' })
  @IsString()
  riskProfile: string;
}

class MLAnalysisDto {
  @ApiProperty({ type: TransactionDataDto })
  @ValidateNested()
  @Type(() => TransactionDataDto)
  transactionData: TransactionDataDto;

  @ApiProperty({ type: EntityDataDto })
  @ValidateNested()
  @Type(() => EntityDataDto)
  entityData: EntityDataDto;
}

class PEPScreeningDto {
  @ApiProperty({
    description: 'Full name of the person to screen for PEP status',
    example: 'Vladimir Putin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Country of residence or nationality',
    example: 'RU',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Birth year for better matching',
    example: 1952,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  birthYear?: number;
}

class AdverseMediaDto {
  @ApiProperty({
    description: 'Name to screen for adverse media',
    example: 'Enron Corporation',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Entity type for search optimization',
    enum: ['person', 'company'],
    example: 'company',
  })
  @IsEnum(['person', 'company'])
  entityType: 'person' | 'company';
}

class ComprehensiveScreeningDto {
  @ApiProperty({
    description: 'Entity name for comprehensive screening',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Entity type',
    enum: ['person', 'company'],
    example: 'person',
  })
  @IsEnum(['person', 'company'])
  entityType: 'person' | 'company';

  @ApiProperty({
    description: 'Country code',
    example: 'US',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Date of birth or incorporation',
    example: '1980-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Main St, New York, NY 10001',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Identification numbers',
    type: [String],
    example: ['SSN123456789', 'PASS987654321'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  identifiers?: string[];
}

// Response DTOs
class SanctionMatchDto {
  @ApiProperty({ example: 'SANC_12345' })
  id: string;

  @ApiProperty({ example: 'John Smith' })
  name: string;

  @ApiProperty({ example: 0.95 })
  score: number;

  @ApiProperty({ example: 'OFAC SDN List' })
  sanctionList: string;

  @ApiProperty({ example: 'Individual' })
  designation: string;

  @ApiProperty({ example: 'US', required: false })
  nationality?: string;

  @ApiProperty({ example: '1980-01-15', required: false })
  dateOfBirth?: string;

  @ApiProperty({ example: ['J. Smith', 'Johnny Smith'] })
  aliases: string[];

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  lastUpdated: Date;
}

class SanctionsScreeningResponseDto {
  @ApiProperty({ example: true })
  hasMatches: boolean;

  @ApiProperty({ type: [SanctionMatchDto] })
  matches: SanctionMatchDto[];

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  screeningDate: Date;
}

@ApiTags('Compliance Screening')
@ApiBearerAuth()
@Controller('api/v1/compliance')
@ApiExtraModels(
  SanctionMatchDto,
  SanctionsScreeningResponseDto,
  TransactionDataDto,
  EntityDataDto,
)
export class ComplianceScreeningController {
  private readonly logger = new Logger(ComplianceScreeningController.name);

  constructor(
    private readonly integrationService: ExternalIntegrationsService,
    private readonly eventBus: EventBus,
  ) {}

  @Post('screen/sanctions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Screen entity against global sanctions lists',
    description: 'Screens individuals or companies against OpenSanctions database and other free sanctions sources',
  })
  @ApiBody({ type: ScreeningSanctionsDto })
  @ApiResponse({
    status: 200,
    description: 'Sanctions screening completed',
    type: SanctionsScreeningResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async screenSanctions(@Body() dto: ScreeningSanctionsDto) {
    try {
      this.logger.log(`Sanctions screening requested for: ${dto.name}`);
      
      // Generate unique entity ID for tracking
      const entityId = `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Emit domain event: screening requested
      this.eventBus.publish(new SanctionsScreenRequestedEvent(
        entityId,
        dto.entityType,
        {
          name: dto.name,
          birthDate: dto.birthDate,
          country: dto.country,
        }
      ));
      
      const result = await this.integrationService.screenSanctions({
        name: dto.name,
        birthDate: dto.birthDate,
        country: dto.country,
        entityType: dto.entityType,
      });

      // Emit domain event: screening completed
      const mappedMatches = result.matches.map(match => ({
        name: match.name,
        listName: match.sanctionList,
        matchScore: match.score,
        reason: match.designation,
      }));

      this.eventBus.publish(new SanctionsScreenCompletedEvent(
        entityId,
        `screening_${Date.now()}`,
        result.hasMatches,
        mappedMatches
      ));

      return {
        ...result,
        entityId, // Include entityId in response for tracking
        metadata: {
          service: 'OpenSanctions',
          version: '2.0',
          disclaimer: 'Screening provided by free OpenSanctions API',
        },
      };
    } catch (error) {
      this.logger.error(`Sanctions screening failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform sanctions screening');
    }
  }

  @Post('screen/ofac')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Screen against OFAC SDN List',
    description: 'Screens entities against the US Treasury OFAC Specially Designated Nationals list',
  })
  @ApiBody({ type: ScreeningOFACDto })
  @ApiResponse({
    status: 200,
    description: 'OFAC screening completed',
    schema: {
      type: 'object',
      properties: {
        isOnSDNList: { type: 'boolean', example: false },
        matches: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'John Doe' },
              type: { type: 'string', example: 'Individual' },
              programs: { type: 'array', items: { type: 'string' }, example: ['SDGT'] },
              remarks: { type: 'string', example: 'DOB 01 Jan 1980' },
              score: { type: 'number', example: 0.95 },
              addresses: { type: 'array', items: { type: 'string' } },
              ids: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', example: 'Passport' },
                    number: { type: 'string', example: 'A123456' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async screenOFAC(@Body() dto: ScreeningOFACDto) {
    try {
      this.logger.log(`OFAC screening requested for: ${dto.name}`);
      
      return await this.integrationService.screenOFAC({
        name: dto.name,
        address: dto.address,
        idNumber: dto.idNumber,
      });
    } catch (error) {
      this.logger.error(`OFAC screening failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform OFAC screening');
    }
  }

  @Post('assess/geographic-risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Assess geographic and jurisdictional risk',
    description: 'Evaluates risk based on country, sanctions, FATF status, and corruption indices',
  })
  @ApiBody({ type: GeographicRiskDto })
  @ApiResponse({
    status: 200,
    description: 'Geographic risk assessment completed',
    schema: {
      type: 'object',
      properties: {
        riskScore: { type: 'number', example: 0.7 },
        country: { type: 'string', example: 'Syria' },
        region: { type: 'string', example: 'Middle East' },
        riskFactors: {
          type: 'array',
          items: { type: 'string' },
          example: ['Sanctioned country', 'FATF grey list'],
        },
        fatfStatus: { type: 'string', example: 'Grey List' },
        corruptionIndex: { type: 'number', example: 25 },
        sanctioned: { type: 'boolean', example: true },
      },
    },
  })
  async assessGeographicRisk(@Body() dto: GeographicRiskDto) {
    try {
      this.logger.log('Geographic risk assessment requested');
      
      return await this.integrationService.assessGeographicRisk({
        country: dto.country,
        address: dto.address,
        coordinates: dto.coordinates,
      });
    } catch (error) {
      this.logger.error(`Geographic risk assessment failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to assess geographic risk');
    }
  }

  @Post('analyze/ml-risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze transaction risk using ML models',
    description: 'Uses machine learning to analyze transaction patterns and detect anomalies',
  })
  @ApiBody({ type: MLAnalysisDto })
  @ApiResponse({
    status: 200,
    description: 'ML risk analysis completed',
    schema: {
      type: 'object',
      properties: {
        riskScore: { type: 'number', example: 0.65 },
        anomalyScore: { type: 'number', example: 0.45 },
        prediction: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
        confidence: { type: 'number', example: 0.85 },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
          example: ['Flag for manual review', 'Request additional KYC'],
        },
      },
    },
  })
  async analyzeWithML(@Body() dto: MLAnalysisDto) {
    try {
      this.logger.log('ML risk analysis requested');
      
      return await this.integrationService.analyzeWithML({
        transactionData: dto.transactionData,
        entityData: dto.entityData,
      });
    } catch (error) {
      this.logger.error(`ML analysis failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform ML risk analysis');
    }
  }

  @Post('screen/pep')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Screen for Politically Exposed Persons (PEPs)',
    description: 'Checks if an individual is a PEP or related to a PEP',
  })
  @ApiBody({ type: PEPScreeningDto })
  @ApiResponse({
    status: 200,
    description: 'PEP screening completed',
    schema: {
      type: 'object',
      properties: {
        isPEP: { type: 'boolean', example: true },
        positions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Minister of Finance' },
              organization: { type: 'string', example: 'Government of Country' },
              country: { type: 'string', example: 'US' },
              startDate: { type: 'string', example: '2020-01-01' },
              endDate: { type: 'string', example: '2023-12-31' },
              current: { type: 'boolean', example: false },
            },
          },
        },
        familyMembers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Jane Doe' },
              relationship: { type: 'string', example: 'Spouse' },
            },
          },
        },
        riskLevel: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
      },
    },
  })
  async screenPEP(@Body() dto: PEPScreeningDto) {
    try {
      this.logger.log(`PEP screening requested for: ${dto.name}`);
      
      return await this.integrationService.screenPEP({
        name: dto.name,
        country: dto.country,
        birthYear: dto.birthYear,
      });
    } catch (error) {
      this.logger.error(`PEP screening failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform PEP screening');
    }
  }

  @Post('screen/adverse-media')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Screen for adverse media coverage',
    description: 'Searches for negative news and media coverage about an entity',
  })
  @ApiBody({ type: AdverseMediaDto })
  @ApiResponse({
    status: 200,
    description: 'Adverse media screening completed',
    schema: {
      type: 'object',
      properties: {
        hasAdverseMedia: { type: 'boolean', example: true },
        articles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Company under investigation for fraud' },
              source: { type: 'string', example: 'Financial Times' },
              date: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00Z' },
              riskCategory: { type: 'string', example: 'Financial Crime' },
              snippet: { type: 'string', example: 'Authorities are investigating...' },
            },
          },
        },
        riskScore: { type: 'number', example: 0.7 },
      },
    },
  })
  async screenAdverseMedia(@Body() dto: AdverseMediaDto) {
    try {
      this.logger.log(`Adverse media screening requested for: ${dto.name}`);
      
      return await this.integrationService.screenAdverseMedia({
        name: dto.name,
        entityType: dto.entityType,
      });
    } catch (error) {
      this.logger.error(`Adverse media screening failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform adverse media screening');
    }
  }

  @Get('check/ip/:ipAddress')
  @ApiOperation({
    summary: 'Check IP address geolocation and risk',
    description: 'Analyzes IP address for location, VPN/proxy detection, and associated risks',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP address to check',
    example: '8.8.8.8',
  })
  @ApiResponse({
    status: 200,
    description: 'IP geolocation check completed',
    schema: {
      type: 'object',
      properties: {
        country: { type: 'string', example: 'United States' },
        city: { type: 'string', example: 'Mountain View' },
        region: { type: 'string', example: 'California' },
        isVPN: { type: 'boolean', example: false },
        isTor: { type: 'boolean', example: false },
        isProxy: { type: 'boolean', example: false },
        riskScore: { type: 'number', example: 0.2 },
      },
    },
  })
  async checkIPGeolocation(@Param('ipAddress') ipAddress: string) {
    try {
      this.logger.log(`IP geolocation check requested for: ${ipAddress}`);
      
      return await this.integrationService.checkIPGeolocation(ipAddress);
    } catch (error) {
      this.logger.error(`IP geolocation check failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check IP geolocation');
    }
  }

  @Get('currency-risk/:currency')
  @ApiOperation({
    summary: 'Assess currency-related risks',
    description: 'Evaluates risks associated with specific currencies including volatility and restrictions',
  })
  @ApiParam({
    name: 'currency',
    description: 'Currency code (ISO 4217)',
    example: 'IRR',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency risk assessment completed',
    schema: {
      type: 'object',
      properties: {
        isHighRisk: { type: 'boolean', example: true },
        volatility: { type: 'number', example: 0.8 },
        restrictedJurisdiction: { type: 'boolean', example: true },
      },
    },
  })
  async getCurrencyRisk(@Param('currency') currency: string) {
    try {
      this.logger.log(`Currency risk assessment requested for: ${currency}`);
      
      return await this.integrationService.getCurrencyRisk(currency);
    } catch (error) {
      this.logger.error(`Currency risk assessment failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to assess currency risk');
    }
  }

  @Post('screen/comprehensive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Perform comprehensive compliance screening',
    description: 'Runs all available screening checks including sanctions, PEP, adverse media, and geographic risk',
  })
  @ApiBody({ type: ComprehensiveScreeningDto })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive screening completed',
    schema: {
      type: 'object',
      properties: {
        overallRiskScore: { type: 'number', example: 0.65 },
        riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'medium' },
        sanctions: { type: 'object' },
        ofac: { type: 'object' },
        pep: { type: 'object' },
        adverseMedia: { type: 'object' },
        geographicRisk: { type: 'object' },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
          example: ['Enhanced due diligence required', 'Request source of funds documentation'],
        },
        screeningDate: { type: 'string', format: 'date-time' },
      },
    },
  })
  async comprehensiveScreening(@Body() dto: ComprehensiveScreeningDto) {
    try {
      this.logger.log(`Comprehensive screening requested for: ${dto.name}`);
      
      // Run all screenings in parallel
      const [sanctions, ofac, pep, adverseMedia, geographic] = await Promise.all([
        this.integrationService.screenSanctions({
          name: dto.name,
          birthDate: dto.dateOfBirth,
          country: dto.country,
          entityType: dto.entityType,
        }),
        this.integrationService.screenOFAC({
          name: dto.name,
          address: dto.address,
        }),
        dto.entityType === 'person' ? 
          this.integrationService.screenPEP({
            name: dto.name,
            country: dto.country,
          }) : Promise.resolve({ isPEP: false, positions: [], familyMembers: [], riskLevel: 'low' as const }),
        this.integrationService.screenAdverseMedia({
          name: dto.name,
          entityType: dto.entityType,
        }),
        this.integrationService.assessGeographicRisk({
          country: dto.country,
          address: dto.address,
        }),
      ]);

      // Calculate overall risk score
      let overallRiskScore = 0;
      const recommendations: string[] = [];

      if (sanctions.hasMatches) {
        overallRiskScore += 0.9;
        recommendations.push('Entity found on sanctions list - reject or freeze account');
      }

      if (ofac.isOnSDNList) {
        overallRiskScore += 0.9;
        recommendations.push('OFAC SDN list match - regulatory reporting required');
      }

      if (pep.isPEP) {
        overallRiskScore += pep.riskLevel === 'high' ? 0.6 : 0.4;
        recommendations.push('PEP identified - enhanced due diligence required');
      }

      if (adverseMedia.hasAdverseMedia) {
        overallRiskScore += adverseMedia.riskScore * 0.5;
        recommendations.push('Adverse media found - investigate further');
      }

      overallRiskScore += geographic.riskScore * 0.3;
      
      if (geographic.sanctioned) {
        recommendations.push('High-risk jurisdiction - additional verification required');
      }

      // Normalize score
      overallRiskScore = Math.min(1.0, overallRiskScore);

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (overallRiskScore >= 0.8) riskLevel = 'critical';
      else if (overallRiskScore >= 0.6) riskLevel = 'high';
      else if (overallRiskScore >= 0.3) riskLevel = 'medium';
      else riskLevel = 'low';

      // Add general recommendations
      if (riskLevel === 'high' || riskLevel === 'critical') {
        recommendations.push('Request source of funds documentation');
        recommendations.push('Perform enhanced KYC verification');
        recommendations.push('Consider filing SAR if suspicious activity detected');
      }

      return {
        overallRiskScore,
        riskLevel,
        sanctions,
        ofac,
        pep,
        adverseMedia,
        geographicRisk: geographic,
        recommendations,
        screeningDate: new Date(),
        metadata: {
          services: [
            'OpenSanctions API',
            'OFAC SDN List',
            'OpenStreetMap Nominatim',
            'RestCountries API',
          ],
          disclaimer: 'Screening results are based on free, open-source data sources',
        },
      };
    } catch (error) {
      this.logger.error(`Comprehensive screening failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform comprehensive screening');
    }
  }
}