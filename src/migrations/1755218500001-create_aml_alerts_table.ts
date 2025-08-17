import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm";

export class CreateAmlAlertsTable1755218500001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "aml_alerts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "risk_profile_id",
            type: "uuid",
          },
          {
            name: "entity_id",
            type: "uuid",
            comment: "User ID or Business ID",
          },
          {
            name: "alert_reference",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "alert_type",
            type: "enum",
            enum: [
              "HIGH_VALUE_TRANSACTION",
              "UNUSUAL_PATTERN",
              "VELOCITY_CHECK",
              "SANCTIONS_HIT",
              "PEP_TRANSACTION",
              "HIGH_RISK_COUNTRY",
              "STRUCTURING",
              "ROUND_DOLLAR_AMOUNTS",
              "DORMANT_ACCOUNT_ACTIVITY",
              "FREQUENT_SMALL_TRANSACTIONS",
              "CASH_INTENSIVE_BUSINESS",
              "RAPID_MOVEMENT_OF_FUNDS",
              "ML_ANOMALY_DETECTION",
              "MANUAL_REVIEW"
            ],
          },
          {
            name: "severity",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "'MEDIUM'",
          },
          {
            name: "priority",
            type: "enum",
            enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
            default: "'NORMAL'",
          },
          {
            name: "status",
            type: "enum",
            enum: ["OPEN", "IN_PROGRESS", "CLOSED", "FALSE_POSITIVE", "ESCALATED"],
            default: "'OPEN'",
          },
          {
            name: "risk_score",
            type: "decimal",
            precision: 5,
            scale: 2,
          },
          {
            name: "confidence_level",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "transaction_id",
            type: "uuid",
            isNullable: true,
            comment: "Related transaction ID if applicable",
          },
          {
            name: "transaction_amount",
            type: "decimal",
            precision: 19,
            scale: 4,
            isNullable: true,
          },
          {
            name: "transaction_currency",
            type: "varchar",
            length: "3",
            isNullable: true,
          },
          {
            name: "alert_data",
            type: "jsonb",
            comment: "Detailed alert information and context",
          },
          {
            name: "detection_rules",
            type: "jsonb",
            comment: "Rules that triggered this alert",
          },
          {
            name: "ml_features",
            type: "jsonb",
            isNullable: true,
            comment: "ML model features and outputs",
          },
          {
            name: "investigation_notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "resolution_notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "false_positive_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "assigned_to",
            type: "uuid",
            isNullable: true,
            comment: "User ID of assigned investigator",
          },
          {
            name: "assigned_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "investigated_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of investigator",
          },
          {
            name: "investigated_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "resolved_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of resolver",
          },
          {
            name: "resolved_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "escalated_to",
            type: "uuid",
            isNullable: true,
            comment: "User ID of escalation recipient",
          },
          {
            name: "escalated_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "sar_filed",
            type: "boolean",
            default: false,
            comment: "Suspicious Activity Report filed",
          },
          {
            name: "sar_reference",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "sar_filed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "auto_generated",
            type: "boolean",
            default: true,
          },
          {
            name: "sla_due_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "sla_breached",
            type: "boolean",
            default: false,
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "Array of tags for categorization",
          },
          {
            name: "related_alerts",
            type: "jsonb",
            isNullable: true,
            comment: "Array of related alert IDs",
          },
          {
            name: "external_references",
            type: "jsonb",
            isNullable: true,
            comment: "External system references",
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
            name: "IDX_AML_ALERTS_RISK_PROFILE_ID",
            columnNames: ["risk_profile_id"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_ENTITY_ID",
            columnNames: ["entity_id"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_REFERENCE",
            columnNames: ["alert_reference"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_TYPE",
            columnNames: ["alert_type"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_SEVERITY",
            columnNames: ["severity"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_PRIORITY",
            columnNames: ["priority"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_STATUS",
            columnNames: ["status"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_RISK_SCORE",
            columnNames: ["risk_score"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_TRANSACTION_ID",
            columnNames: ["transaction_id"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_ASSIGNED_TO",
            columnNames: ["assigned_to"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_SAR_FILED",
            columnNames: ["sar_filed"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_AUTO_GENERATED",
            columnNames: ["auto_generated"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_SLA_DUE",
            columnNames: ["sla_due_date"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_SLA_BREACHED",
            columnNames: ["sla_breached"],
          }),
          new Index({
            name: "IDX_AML_ALERTS_CREATED_AT",
            columnNames: ["created_at"],
          }),
        ],
        foreignKeys: [
          new ForeignKey({
            name: "FK_AML_ALERTS_RISK_PROFILE_ID",
            columnNames: ["risk_profile_id"],
            referencedTableName: "risk_profiles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          }),
        ],
      }),
      true,
    );

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_aml_alerts_updated_at 
      BEFORE UPDATE ON aml_alerts 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to generate alert references
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_alert_reference()
      RETURNS TEXT AS $$
      DECLARE
        new_reference TEXT;
        exists_check INTEGER;
      BEGIN
        LOOP
          -- Generate alert reference: AML + YYYYMMDD + 8 random digits
          new_reference := 'AML' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
          
          SELECT COUNT(*) INTO exists_check 
          FROM aml_alerts 
          WHERE alert_reference = new_reference;
          
          IF exists_check = 0 THEN
            EXIT;
          END IF;
        END LOOP;
        
        RETURN new_reference;
      END;
      $$ LANGUAGE plpgsql;
    `);

    -- Create function to calculate SLA due date
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_sla_due_date(severity TEXT)
      RETURNS TIMESTAMP AS $$
      BEGIN
        CASE severity
          WHEN 'CRITICAL' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '4 hours';
          WHEN 'HIGH' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '24 hours';
          WHEN 'MEDIUM' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '72 hours';
          WHEN 'LOW' THEN
            RETURN CURRENT_TIMESTAMP + INTERVAL '7 days';
          ELSE
            RETURN CURRENT_TIMESTAMP + INTERVAL '72 hours';
        END CASE;
      END;
      $$ LANGUAGE plpgsql;
    `);

    -- Create trigger to auto-generate alert references and SLA dates
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_alert_defaults()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.alert_reference IS NULL OR NEW.alert_reference = '' THEN
          NEW.alert_reference := generate_alert_reference();
        END IF;
        
        IF NEW.sla_due_date IS NULL THEN
          NEW.sla_due_date := calculate_sla_due_date(NEW.severity);
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_alert_defaults_trigger
      BEFORE INSERT ON aml_alerts
      FOR EACH ROW
      EXECUTE FUNCTION set_alert_defaults();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_alert_defaults_trigger ON aml_alerts`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_aml_alerts_updated_at ON aml_alerts`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_alert_defaults`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_sla_due_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS generate_alert_reference`);
    await queryRunner.dropTable("aml_alerts");
  }
}