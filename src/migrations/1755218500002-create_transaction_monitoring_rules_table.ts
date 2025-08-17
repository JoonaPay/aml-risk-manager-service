import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class CreateTransactionMonitoringRulesTable1755218500002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transaction_monitoring_rules",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "rule_name",
            type: "varchar",
            length: "200",
            isUnique: true,
          },
          {
            name: "rule_code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "rule_type",
            type: "enum",
            enum: [
              "AMOUNT_THRESHOLD",
              "VELOCITY_CHECK",
              "PATTERN_DETECTION",
              "GEOGRAPHIC_ANOMALY",
              "TIME_BASED",
              "FREQUENCY_CHECK",
              "CONCENTRATION_RISK",
              "STRUCTURING_DETECTION",
              "ROUND_DOLLAR_AMOUNT",
              "DORMANT_ACCOUNT",
              "CASH_INTENSIVE",
              "RAPID_MOVEMENT",
              "HIGH_RISK_COUNTRY",
              "PEP_TRANSACTION",
              "ML_ANOMALY"
            ],
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "rule_logic",
            type: "jsonb",
            comment: "Rule conditions and logic",
          },
          {
            name: "parameters",
            type: "jsonb",
            comment: "Rule parameters and thresholds",
          },
          {
            name: "risk_weight",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "50.00",
            comment: "Weight in overall risk calculation",
          },
          {
            name: "severity_mapping",
            type: "jsonb",
            comment: "Risk score to severity mapping",
          },
          {
            name: "customer_segments",
            type: "jsonb",
            isNullable: true,
            comment: "Applicable customer segments",
          },
          {
            name: "product_types",
            type: "jsonb",
            isNullable: true,
            comment: "Applicable product types",
          },
          {
            name: "geographic_scope",
            type: "jsonb",
            isNullable: true,
            comment: "Geographic application scope",
          },
          {
            name: "time_window",
            type: "interval",
            isNullable: true,
            comment: "Time window for rule evaluation",
          },
          {
            name: "lookback_period",
            type: "interval",
            isNullable: true,
            comment: "Historical data lookback period",
          },
          {
            name: "aggregation_level",
            type: "enum",
            enum: ["TRANSACTION", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY"],
            default: "'TRANSACTION'",
          },
          {
            name: "alert_threshold",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "75.00",
          },
          {
            name: "auto_alert",
            type: "boolean",
            default: true,
          },
          {
            name: "escalation_threshold",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "90.00",
          },
          {
            name: "auto_escalate",
            type: "boolean",
            default: false,
          },
          {
            name: "false_positive_threshold",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: "20.00",
            comment: "Threshold below which alerts are likely false positives",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "is_system_rule",
            type: "boolean",
            default: false,
            comment: "System rules cannot be deleted",
          },
          {
            name: "effectiveness_score",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: "Rule effectiveness based on hit rate",
          },
          {
            name: "hit_rate",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: "Percentage of alerts that are true positives",
          },
          {
            name: "last_triggered",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "trigger_count",
            type: "integer",
            default: 0,
          },
          {
            name: "true_positive_count",
            type: "integer",
            default: 0,
          },
          {
            name: "false_positive_count",
            type: "integer",
            default: 0,
          },
          {
            name: "version",
            type: "integer",
            default: 1,
            comment: "Rule version for tracking changes",
          },
          {
            name: "parent_rule_id",
            type: "uuid",
            isNullable: true,
            comment: "Reference to parent rule if this is a version",
          },
          {
            name: "ml_model_id",
            type: "uuid",
            isNullable: true,
            comment: "Associated ML model if applicable",
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "Rule categorization tags",
          },
          {
            name: "review_schedule",
            type: "enum",
            enum: ["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"],
            default: "'QUARTERLY'",
          },
          {
            name: "last_reviewed",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "next_review_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "reviewed_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of last reviewer",
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
            name: "created_by",
            type: "uuid",
            comment: "User ID of creator",
          },
          {
            name: "updated_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of last updater",
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
            name: "IDX_TM_RULES_NAME",
            columnNames: ["rule_name"],
          }),
          new Index({
            name: "IDX_TM_RULES_CODE",
            columnNames: ["rule_code"],
          }),
          new Index({
            name: "IDX_TM_RULES_TYPE",
            columnNames: ["rule_type"],
          }),
          new Index({
            name: "IDX_TM_RULES_ACTIVE",
            columnNames: ["is_active"],
          }),
          new Index({
            name: "IDX_TM_RULES_SYSTEM",
            columnNames: ["is_system_rule"],
          }),
          new Index({
            name: "IDX_TM_RULES_EFFECTIVENESS",
            columnNames: ["effectiveness_score"],
          }),
          new Index({
            name: "IDX_TM_RULES_LAST_TRIGGERED",
            columnNames: ["last_triggered"],
          }),
          new Index({
            name: "IDX_TM_RULES_PARENT_ID",
            columnNames: ["parent_rule_id"],
          }),
          new Index({
            name: "IDX_TM_RULES_ML_MODEL_ID",
            columnNames: ["ml_model_id"],
          }),
          new Index({
            name: "IDX_TM_RULES_NEXT_REVIEW",
            columnNames: ["next_review_date"],
          }),
          new Index({
            name: "IDX_TM_RULES_CREATED_AT",
            columnNames: ["created_at"],
          }),
        ],
      }),
      true,
    );

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_transaction_monitoring_rules_updated_at 
      BEFORE UPDATE ON transaction_monitoring_rules 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to calculate rule effectiveness
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_rule_effectiveness()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Calculate hit rate
        IF (NEW.trigger_count > 0) THEN
          NEW.hit_rate := (NEW.true_positive_count::decimal / NEW.trigger_count::decimal) * 100;
        ELSE
          NEW.hit_rate := NULL;
        END IF;
        
        -- Calculate effectiveness score (weighted by volume and accuracy)
        IF NEW.hit_rate IS NOT NULL THEN
          NEW.effectiveness_score := CASE
            WHEN NEW.hit_rate >= 80 THEN 90 + (NEW.hit_rate - 80) / 2
            WHEN NEW.hit_rate >= 60 THEN 70 + (NEW.hit_rate - 60)
            WHEN NEW.hit_rate >= 40 THEN 50 + (NEW.hit_rate - 40)
            WHEN NEW.hit_rate >= 20 THEN 30 + (NEW.hit_rate - 20)
            ELSE NEW.hit_rate
          END;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER calculate_rule_effectiveness_trigger
      BEFORE UPDATE OF trigger_count, true_positive_count, false_positive_count ON transaction_monitoring_rules
      FOR EACH ROW
      EXECUTE FUNCTION calculate_rule_effectiveness();
    `);

    // Create function to set next review date
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_next_rule_review_date()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.next_review_date IS NULL THEN
          NEW.next_review_date := CASE NEW.review_schedule
            WHEN 'MONTHLY' THEN CURRENT_TIMESTAMP + INTERVAL '1 month'
            WHEN 'QUARTERLY' THEN CURRENT_TIMESTAMP + INTERVAL '3 months'
            WHEN 'SEMI_ANNUALLY' THEN CURRENT_TIMESTAMP + INTERVAL '6 months'
            WHEN 'ANNUALLY' THEN CURRENT_TIMESTAMP + INTERVAL '1 year'
            ELSE CURRENT_TIMESTAMP + INTERVAL '3 months'
          END;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_next_rule_review_date_trigger
      BEFORE INSERT ON transaction_monitoring_rules
      FOR EACH ROW
      EXECUTE FUNCTION set_next_rule_review_date();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_next_rule_review_date_trigger ON transaction_monitoring_rules`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS calculate_rule_effectiveness_trigger ON transaction_monitoring_rules`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_transaction_monitoring_rules_updated_at ON transaction_monitoring_rules`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_next_rule_review_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_rule_effectiveness`);
    await queryRunner.dropTable("transaction_monitoring_rules");
  }
}