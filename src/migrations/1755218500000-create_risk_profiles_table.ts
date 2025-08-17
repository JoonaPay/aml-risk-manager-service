import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class CreateRiskProfilesTable1755218500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create extension for UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    await queryRunner.createTable(
      new Table({
        name: "risk_profiles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "entity_id",
            type: "uuid",
            comment: "User ID or Business ID",
          },
          {
            name: "entity_type",
            type: "enum",
            enum: ["INDIVIDUAL", "BUSINESS"],
          },
          {
            name: "risk_level",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "'MEDIUM'",
          },
          {
            name: "overall_risk_score",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "50.00",
          },
          {
            name: "customer_type",
            type: "enum",
            enum: ["RETAIL", "CORPORATE", "HIGH_NET_WORTH", "INSTITUTIONAL"],
            default: "'RETAIL'",
          },
          {
            name: "customer_segment",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "geographic_risk",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "'MEDIUM'",
          },
          {
            name: "product_risk",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "'MEDIUM'",
          },
          {
            name: "channel_risk",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "'MEDIUM'",
          },
          {
            name: "occupation_risk",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            isNullable: true,
          },
          {
            name: "industry_risk",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH"],
            isNullable: true,
          },
          {
            name: "pep_status",
            type: "boolean",
            default: false,
            comment: "Politically Exposed Person",
          },
          {
            name: "sanctions_hit",
            type: "boolean",
            default: false,
          },
          {
            name: "adverse_media",
            type: "boolean",
            default: false,
          },
          {
            name: "risk_factors",
            type: "jsonb",
            comment: "Detailed risk factor breakdown",
          },
          {
            name: "transaction_behavior",
            type: "jsonb",
            comment: "Transaction patterns and behaviors",
          },
          {
            name: "ml_risk_scoring",
            type: "jsonb",
            isNullable: true,
            comment: "Machine learning risk scoring results",
          },
          {
            name: "country_of_residence",
            type: "varchar",
            length: "3", // ISO 3166-1 alpha-3
            isNullable: true,
          },
          {
            name: "countries_of_operation",
            type: "jsonb",
            isNullable: true,
            comment: "Array of countries for business operations",
          },
          {
            name: "regulatory_status",
            type: "enum",
            enum: ["COMPLIANT", "NON_COMPLIANT", "UNDER_REVIEW", "EXEMPT"],
            default: "'UNDER_REVIEW'",
          },
          {
            name: "due_diligence_level",
            type: "enum",
            enum: ["BASIC", "ENHANCED", "ONGOING"],
            default: "'BASIC'",
          },
          {
            name: "last_assessment_date",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "next_assessment_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "assessment_frequency",
            type: "enum",
            enum: ["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"],
            default: "'QUARTERLY'",
          },
          {
            name: "risk_appetite_threshold",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "75.00",
          },
          {
            name: "monitoring_enabled",
            type: "boolean",
            default: true,
          },
          {
            name: "alert_threshold",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "80.00",
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "assessed_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of assessor",
          },
          {
            name: "approved_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of approver",
          },
          {
            name: "approved_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          new Index({
            name: "IDX_RISK_PROFILES_ENTITY_ID",
            columnNames: ["entity_id"],
            isUnique: true,
          }),
          new Index({
            name: "IDX_RISK_PROFILES_ENTITY_TYPE",
            columnNames: ["entity_type"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_RISK_LEVEL",
            columnNames: ["risk_level"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_OVERALL_SCORE",
            columnNames: ["overall_risk_score"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_CUSTOMER_TYPE",
            columnNames: ["customer_type"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_PEP_STATUS",
            columnNames: ["pep_status"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_SANCTIONS_HIT",
            columnNames: ["sanctions_hit"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_REGULATORY_STATUS",
            columnNames: ["regulatory_status"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_NEXT_ASSESSMENT",
            columnNames: ["next_assessment_date"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_MONITORING",
            columnNames: ["monitoring_enabled"],
          }),
          new Index({
            name: "IDX_RISK_PROFILES_CREATED_AT",
            columnNames: ["created_at"],
          }),
        ],
      }),
      true,
    );

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_risk_profiles_updated_at 
      BEFORE UPDATE ON risk_profiles 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to calculate next assessment date
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_next_assessment_date(frequency TEXT)
      RETURNS TIMESTAMP AS $$
      BEGIN
        CASE frequency
          WHEN 'MONTHLY' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '1 month';
          WHEN 'QUARTERLY' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '3 months';
          WHEN 'SEMI_ANNUALLY' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '6 months';
          WHEN 'ANNUALLY' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '1 year';
          ELSE
            RETURN CURRENT_TIMESTAMP + INTERVAL '3 months';
        END CASE;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger to set next assessment date
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_next_assessment_date()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.next_assessment_date IS NULL THEN
          NEW.next_assessment_date := calculate_next_assessment_date(NEW.assessment_frequency);
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_next_assessment_date_trigger
      BEFORE INSERT ON risk_profiles
      FOR EACH ROW
      EXECUTE FUNCTION set_next_assessment_date();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_next_assessment_date_trigger ON risk_profiles`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_risk_profiles_updated_at ON risk_profiles`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_next_assessment_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_next_assessment_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.dropTable("risk_profiles");
  }
}