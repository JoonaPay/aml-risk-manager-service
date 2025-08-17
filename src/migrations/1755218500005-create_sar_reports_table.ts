import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm";

export class CreateSarReportsTable1755218500005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sar_reports",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "sar_reference",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "alert_id",
            type: "uuid",
          },
          {
            name: "entity_id",
            type: "uuid",
            comment: "User ID or Business ID being reported",
          },
          {
            name: "entity_type",
            type: "enum",
            enum: ["INDIVIDUAL", "BUSINESS"],
          },
          {
            name: "report_type",
            type: "enum",
            enum: [
              "SUSPICIOUS_ACTIVITY",
              "CURRENCY_TRANSACTION",
              "MONETARY_INSTRUMENT",
              "FOREIGN_BANK_ACCOUNT",
              "SHELL_BANK",
              "CORRESPONDENT_ACCOUNT",
              "WIRE_TRANSFER",
              "CASH_TRANSACTION",
              "MONEY_LAUNDERING",
              "TERRORIST_FINANCING",
              "OTHER_SUSPICIOUS"
            ],
          },
          {
            name: "filing_reason",
            type: "enum",
            enum: [
              "UNUSUAL_TRANSACTION_PATTERN",
              "HIGH_RISK_GEOGRAPHY",
              "SANCTIONS_MATCH",
              "PEP_INVOLVEMENT",
              "STRUCTURING_ACTIVITY",
              "ROUND_DOLLAR_AMOUNTS",
              "RAPID_FUND_MOVEMENT",
              "DORMANT_ACCOUNT_ACTIVITY",
              "CASH_INTENSIVE_BUSINESS",
              "UNUSUAL_VELOCITY",
              "SUSPICIOUS_WIRE_TRANSFERS",
              "INCONSISTENT_WITH_PROFILE",
              "REGULATORY_REQUIREMENT",
              "OTHER"
            ],
          },
          {
            name: "priority",
            type: "enum",
            enum: ["ROUTINE", "PRIORITY", "IMMEDIATE"],
            default: "'ROUTINE'",
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "DRAFT",
              "UNDER_REVIEW",
              "APPROVED",
              "FILED",
              "ACKNOWLEDGED",
              "REJECTED",
              "AMENDED",
              "WITHDRAWN"
            ],
            default: "'DRAFT'",
          },
          {
            name: "subject_information",
            type: "jsonb",
            comment: "Subject entity details (name, address, identification)",
          },
          {
            name: "suspicious_activity_details",
            type: "jsonb",
            comment: "Detailed description of suspicious activity",
          },
          {
            name: "transaction_details",
            type: "jsonb",
            comment: "Related transaction information",
          },
          {
            name: "financial_institution_info",
            type: "jsonb",
            comment: "Filing institution information",
          },
          {
            name: "law_enforcement_info",
            type: "jsonb",
            isNullable: true,
            comment: "Law enforcement contact information if applicable",
          },
          {
            name: "suspicious_activity_period",
            type: "jsonb",
            comment: "Start and end dates of suspicious activity",
          },
          {
            name: "total_amount_involved",
            type: "decimal",
            precision: 19,
            scale: 4,
            isNullable: true,
          },
          {
            name: "currency",
            type: "varchar",
            length: "3",
            default: "'USD'",
          },
          {
            name: "narrative_description",
            type: "text",
            comment: "Detailed narrative of suspicious activity",
          },
          {
            name: "law_enforcement_notified",
            type: "boolean",
            default: false,
          },
          {
            name: "law_enforcement_agency",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "law_enforcement_contact",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "regulatory_agency",
            type: "enum",
            enum: ["FINCEN", "OCC", "FDIC", "FRB", "NCUA", "IRS", "OTHER"],
            default: "'FINCEN'",
          },
          {
            name: "filing_method",
            type: "enum",
            enum: ["ELECTRONIC", "PAPER", "OTHER"],
            default: "'ELECTRONIC'",
          },
          {
            name: "form_type",
            type: "varchar",
            length: "50",
            default: "'FinCEN SAR'",
          },
          {
            name: "bsa_id",
            type: "varchar",
            length: "100",
            isNullable: true,
            comment: "BSA E-Filing System ID",
          },
          {
            name: "acknowledgment_number",
            type: "varchar",
            length: "100",
            isNullable: true,
            comment: "Government acknowledgment number",
          },
          {
            name: "filing_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "filing_deadline",
            type: "timestamp",
            comment: "30-day filing deadline from detection",
          },
          {
            name: "late_filing",
            type: "boolean",
            default: false,
          },
          {
            name: "late_filing_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "amendment_to_sar",
            type: "varchar",
            length: "100",
            isNullable: true,
            comment: "Original SAR reference if this is an amendment",
          },
          {
            name: "amendment_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "corrected_sar",
            type: "boolean",
            default: false,
          },
          {
            name: "correction_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "confidentiality_claim",
            type: "boolean",
            default: true,
            comment: "Claim confidentiality under 31 USC 5318(g)",
          },
          {
            name: "supporting_documentation",
            type: "jsonb",
            isNullable: true,
            comment: "Attachments and supporting documents",
          },
          {
            name: "internal_case_number",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "external_references",
            type: "jsonb",
            isNullable: true,
            comment: "External system references",
          },
          {
            name: "risk_assessment",
            type: "jsonb",
            isNullable: true,
            comment: "Risk assessment details that led to filing",
          },
          {
            name: "investigation_summary",
            type: "text",
            isNullable: true,
            comment: "Summary of investigation conducted",
          },
          {
            name: "follow_up_actions",
            type: "jsonb",
            isNullable: true,
            comment: "Post-filing follow-up actions",
          },
          {
            name: "quality_assurance_review",
            type: "boolean",
            default: false,
          },
          {
            name: "qa_reviewer",
            type: "uuid",
            isNullable: true,
            comment: "User ID of QA reviewer",
          },
          {
            name: "qa_reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "qa_comments",
            type: "text",
            isNullable: true,
          },
          {
            name: "compliance_officer_review",
            type: "boolean",
            default: false,
          },
          {
            name: "compliance_officer",
            type: "uuid",
            isNullable: true,
            comment: "User ID of compliance officer",
          },
          {
            name: "compliance_reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "compliance_comments",
            type: "text",
            isNullable: true,
          },
          {
            name: "legal_review",
            type: "boolean",
            default: false,
          },
          {
            name: "legal_reviewer",
            type: "uuid",
            isNullable: true,
            comment: "User ID of legal reviewer",
          },
          {
            name: "legal_reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "legal_comments",
            type: "text",
            isNullable: true,
          },
          {
            name: "auto_generated",
            type: "boolean",
            default: false,
            comment: "SAR was auto-generated by system",
          },
          {
            name: "generation_criteria",
            type: "jsonb",
            isNullable: true,
            comment: "Criteria used for auto-generation",
          },
          {
            name: "ai_assisted",
            type: "boolean",
            default: false,
            comment: "AI assistance used in preparation",
          },
          {
            name: "ai_confidence_score",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "SAR categorization tags",
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
            name: "filed_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of filer",
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
            name: "IDX_SAR_REPORTS_REFERENCE",
            columnNames: ["sar_reference"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_ALERT_ID",
            columnNames: ["alert_id"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_ENTITY_ID",
            columnNames: ["entity_id"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_ENTITY_TYPE",
            columnNames: ["entity_type"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_TYPE",
            columnNames: ["report_type"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_REASON",
            columnNames: ["filing_reason"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_PRIORITY",
            columnNames: ["priority"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_STATUS",
            columnNames: ["status"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_FILING_DATE",
            columnNames: ["filing_date"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_FILING_DEADLINE",
            columnNames: ["filing_deadline"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_LATE_FILING",
            columnNames: ["late_filing"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_BSA_ID",
            columnNames: ["bsa_id"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_ACKNOWLEDGMENT",
            columnNames: ["acknowledgment_number"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_AUTO_GENERATED",
            columnNames: ["auto_generated"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_AI_ASSISTED",
            columnNames: ["ai_assisted"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_QA_REVIEW",
            columnNames: ["quality_assurance_review"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_COMPLIANCE_REVIEW",
            columnNames: ["compliance_officer_review"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_LEGAL_REVIEW",
            columnNames: ["legal_review"],
          }),
          new Index({
            name: "IDX_SAR_REPORTS_CREATED_AT",
            columnNames: ["created_at"],
          }),
        ],
        foreignKeys: [
          new ForeignKey({
            name: "FK_SAR_REPORTS_ALERT_ID",
            columnNames: ["alert_id"],
            referencedTableName: "aml_alerts",
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
      CREATE TRIGGER update_sar_reports_updated_at 
      BEFORE UPDATE ON sar_reports 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to generate SAR references
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_sar_reference()
      RETURNS TEXT AS $$
      DECLARE
        new_reference TEXT;
        exists_check INTEGER;
      BEGIN
        LOOP
          -- Generate SAR reference: SAR + YYYY + 8 random digits
          new_reference := 'SAR' || TO_CHAR(CURRENT_DATE, 'YYYY') || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
          
          SELECT COUNT(*) INTO exists_check 
          FROM sar_reports 
          WHERE sar_reference = new_reference;
          
          IF exists_check = 0 THEN
            EXIT;
          END IF;
        END LOOP;
        
        RETURN new_reference;
      END;
      $$ LANGUAGE plpgsql;
    `);

    -- Create function to calculate filing deadline
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_filing_deadline()
      RETURNS TRIGGER AS $$
      BEGIN
        -- SAR must be filed within 30 calendar days of detection
        IF NEW.filing_deadline IS NULL THEN
          NEW.filing_deadline := CURRENT_DATE + INTERVAL '30 days';
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    -- Create function to check for late filing
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_late_filing()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Check if filing is after deadline
        IF NEW.filing_date IS NOT NULL AND NEW.filing_deadline IS NOT NULL THEN
          NEW.late_filing := NEW.filing_date > NEW.filing_deadline;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    -- Create trigger to auto-generate SAR references and set deadlines
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_sar_defaults()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.sar_reference IS NULL OR NEW.sar_reference = '' THEN
          NEW.sar_reference := generate_sar_reference();
        END IF;
        
        NEW := calculate_filing_deadline(NEW);
        NEW := check_late_filing(NEW);
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_sar_defaults_trigger
      BEFORE INSERT OR UPDATE ON sar_reports
      FOR EACH ROW
      EXECUTE FUNCTION set_sar_defaults();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_sar_defaults_trigger ON sar_reports`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_sar_reports_updated_at ON sar_reports`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_sar_defaults`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS check_late_filing`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_filing_deadline`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS generate_sar_reference`);
    await queryRunner.dropTable("sar_reports");
  }
}