import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm";

export class CreateInvestigationNotesTable1755218500004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "investigation_notes",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "alert_id",
            type: "uuid",
          },
          {
            name: "case_id",
            type: "varchar",
            length: "100",
            isNullable: true,
            comment: "External case management system ID",
          },
          {
            name: "note_type",
            type: "enum",
            enum: [
              "INITIAL_REVIEW",
              "INVESTIGATION_PROGRESS",
              "EVIDENCE_COLLECTION",
              "EXTERNAL_INQUIRY",
              "CUSTOMER_CONTACT",
              "REGULATORY_COMMUNICATION",
              "MANAGEMENT_ESCALATION",
              "RESOLUTION_DECISION",
              "FALSE_POSITIVE_REASONING",
              "SAR_PREPARATION",
              "FOLLOW_UP_ACTION",
              "SYSTEM_NOTE",
              "GENERAL"
            ],
          },
          {
            name: "priority",
            type: "enum",
            enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
            default: "'NORMAL'",
          },
          {
            name: "subject",
            type: "varchar",
            length: "200",
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "investigation_step",
            type: "enum",
            enum: [
              "INITIAL_TRIAGE",
              "DATA_COLLECTION",
              "PATTERN_ANALYSIS",
              "CUSTOMER_REVIEW",
              "TRANSACTION_ANALYSIS",
              "EXTERNAL_CHECK",
              "RISK_ASSESSMENT",
              "DECISION_MAKING",
              "DOCUMENTATION",
              "CLOSURE"
            ],
            isNullable: true,
          },
          {
            name: "findings",
            type: "jsonb",
            isNullable: true,
            comment: "Structured investigation findings",
          },
          {
            name: "evidence_collected",
            type: "jsonb",
            isNullable: true,
            comment: "Evidence and supporting documents",
          },
          {
            name: "action_items",
            type: "jsonb",
            isNullable: true,
            comment: "Follow-up actions required",
          },
          {
            name: "risk_indicators",
            type: "jsonb",
            isNullable: true,
            comment: "Identified risk indicators",
          },
          {
            name: "regulatory_implications",
            type: "text",
            isNullable: true,
          },
          {
            name: "recommendations",
            type: "text",
            isNullable: true,
          },
          {
            name: "related_transactions",
            type: "jsonb",
            isNullable: true,
            comment: "Array of related transaction IDs",
          },
          {
            name: "related_entities",
            type: "jsonb",
            isNullable: true,
            comment: "Related customers or entities",
          },
          {
            name: "external_references",
            type: "jsonb",
            isNullable: true,
            comment: "External system references and IDs",
          },
          {
            name: "attachments",
            type: "jsonb",
            isNullable: true,
            comment: "File attachments and documents",
          },
          {
            name: "confidentiality_level",
            type: "enum",
            enum: ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"],
            default: "'INTERNAL'",
          },
          {
            name: "is_system_generated",
            type: "boolean",
            default: false,
          },
          {
            name: "is_ai_assisted",
            type: "boolean",
            default: false,
            comment: "Note was AI-assisted or generated",
          },
          {
            name: "ai_confidence_score",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: "AI confidence in analysis or recommendation",
          },
          {
            name: "time_spent_minutes",
            type: "integer",
            isNullable: true,
            comment: "Time spent on this investigation step",
          },
          {
            name: "investigation_status_change",
            type: "jsonb",
            isNullable: true,
            comment: "Status changes made during this investigation step",
          },
          {
            name: "escalation_triggered",
            type: "boolean",
            default: false,
          },
          {
            name: "escalation_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "escalated_to",
            type: "uuid",
            isNullable: true,
            comment: "User ID escalated to",
          },
          {
            name: "escalated_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "follow_up_required",
            type: "boolean",
            default: false,
          },
          {
            name: "follow_up_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "follow_up_assigned_to",
            type: "uuid",
            isNullable: true,
            comment: "User ID for follow-up assignment",
          },
          {
            name: "reviewed",
            type: "boolean",
            default: false,
          },
          {
            name: "reviewed_by",
            type: "uuid",
            isNullable: true,
            comment: "User ID of reviewer",
          },
          {
            name: "reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "review_comments",
            type: "text",
            isNullable: true,
          },
          {
            name: "approved",
            type: "boolean",
            default: false,
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
            name: "version",
            type: "integer",
            default: 1,
            comment: "Note version for tracking edits",
          },
          {
            name: "parent_note_id",
            type: "uuid",
            isNullable: true,
            comment: "Parent note if this is an edit/update",
          },
          {
            name: "edit_reason",
            type: "text",
            isNullable: true,
            comment: "Reason for editing the note",
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "Note categorization tags",
          },
          {
            name: "search_vector",
            type: "tsvector",
            isNullable: true,
            comment: "Full-text search vector",
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
            name: "IDX_INVESTIGATION_NOTES_ALERT_ID",
            columnNames: ["alert_id"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_CASE_ID",
            columnNames: ["case_id"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_TYPE",
            columnNames: ["note_type"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_PRIORITY",
            columnNames: ["priority"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_STEP",
            columnNames: ["investigation_step"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_CONFIDENTIALITY",
            columnNames: ["confidentiality_level"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_SYSTEM_GENERATED",
            columnNames: ["is_system_generated"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_AI_ASSISTED",
            columnNames: ["is_ai_assisted"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_ESCALATION",
            columnNames: ["escalation_triggered"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_FOLLOW_UP",
            columnNames: ["follow_up_required"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_FOLLOW_UP_DATE",
            columnNames: ["follow_up_date"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_REVIEWED",
            columnNames: ["reviewed"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_APPROVED",
            columnNames: ["approved"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_PARENT_ID",
            columnNames: ["parent_note_id"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_CREATED_BY",
            columnNames: ["created_by"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_CREATED_AT",
            columnNames: ["created_at"],
          }),
          new Index({
            name: "IDX_INVESTIGATION_NOTES_SEARCH",
            columnNames: ["search_vector"],
            using: "gin",
          }),
        ],
        foreignKeys: [
          new ForeignKey({
            name: "FK_INVESTIGATION_NOTES_ALERT_ID",
            columnNames: ["alert_id"],
            referencedTableName: "aml_alerts",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          }),
          new ForeignKey({
            name: "FK_INVESTIGATION_NOTES_PARENT_NOTE_ID",
            columnNames: ["parent_note_id"],
            referencedTableName: "investigation_notes",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
          }),
        ],
      }),
      true,
    );

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_investigation_notes_updated_at 
      BEFORE UPDATE ON investigation_notes 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to update search vector
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_investigation_notes_search_vector()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.subject, '')), 'A') ||
                            setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B') ||
                            setweight(to_tsvector('english', COALESCE(NEW.recommendations, '')), 'C') ||
                            setweight(to_tsvector('english', COALESCE(NEW.regulatory_implications, '')), 'D');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_investigation_notes_search_vector_trigger
      BEFORE INSERT OR UPDATE OF subject, content, recommendations, regulatory_implications ON investigation_notes
      FOR EACH ROW
      EXECUTE FUNCTION update_investigation_notes_search_vector();
    `);

    -- Create function to handle note versioning
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION handle_note_versioning()
      RETURNS TRIGGER AS $$
      BEGIN
        -- If this is an update to an existing note, increment version
        IF TG_OP = 'UPDATE' AND (
          OLD.subject != NEW.subject OR 
          OLD.content != NEW.content OR
          OLD.recommendations != NEW.recommendations
        ) THEN
          NEW.version := OLD.version + 1;
          NEW.updated_by := NEW.created_by; -- Set updated_by to current user
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER handle_note_versioning_trigger
      BEFORE UPDATE ON investigation_notes
      FOR EACH ROW
      EXECUTE FUNCTION handle_note_versioning();
    `);

    -- Create function to auto-assign follow-up date based on priority
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_follow_up_date()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.follow_up_required = true AND NEW.follow_up_date IS NULL THEN
          NEW.follow_up_date := CASE NEW.priority
            WHEN 'URGENT' THEN CURRENT_TIMESTAMP + INTERVAL '4 hours'
            WHEN 'HIGH' THEN CURRENT_TIMESTAMP + INTERVAL '1 day'
            WHEN 'NORMAL' THEN CURRENT_TIMESTAMP + INTERVAL '3 days'
            WHEN 'LOW' THEN CURRENT_TIMESTAMP + INTERVAL '1 week'
            ELSE CURRENT_TIMESTAMP + INTERVAL '3 days'
          END;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_follow_up_date_trigger
      BEFORE INSERT OR UPDATE OF follow_up_required, priority ON investigation_notes
      FOR EACH ROW
      EXECUTE FUNCTION set_follow_up_date();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_follow_up_date_trigger ON investigation_notes`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS handle_note_versioning_trigger ON investigation_notes`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_investigation_notes_search_vector_trigger ON investigation_notes`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_investigation_notes_updated_at ON investigation_notes`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_follow_up_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS handle_note_versioning`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_investigation_notes_search_vector`);
    await queryRunner.dropTable("investigation_notes");
  }
}