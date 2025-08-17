import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm";

export class CreateMlModelsTable1755218500003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ml_models",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "model_name",
            type: "varchar",
            length: "200",
          },
          {
            name: "model_type",
            type: "enum",
            enum: [
              "ANOMALY_DETECTION",
              "RISK_SCORING",
              "PATTERN_RECOGNITION",
              "TRANSACTION_CLASSIFICATION",
              "BEHAVIORAL_ANALYSIS",
              "FRAUD_DETECTION",
              "CLUSTERING",
              "SUPERVISED_LEARNING",
              "UNSUPERVISED_LEARNING",
              "ENSEMBLE"
            ],
          },
          {
            name: "algorithm",
            type: "enum",
            enum: [
              "ISOLATION_FOREST",
              "ONE_CLASS_SVM",
              "LOCAL_OUTLIER_FACTOR",
              "AUTOENCODER",
              "RANDOM_FOREST",
              "GRADIENT_BOOSTING",
              "NEURAL_NETWORK",
              "LOGISTIC_REGRESSION",
              "KMEANS",
              "DBSCAN",
              "LSTM",
              "TRANSFORMER",
              "ENSEMBLE_VOTING",
              "CUSTOM"
            ],
          },
          {
            name: "version",
            type: "varchar",
            length: "50",
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "purpose",
            type: "text",
            comment: "Business purpose and use case",
          },
          {
            name: "model_config",
            type: "jsonb",
            comment: "Model hyperparameters and configuration",
          },
          {
            name: "features",
            type: "jsonb",
            comment: "Input features and feature engineering details",
          },
          {
            name: "feature_importance",
            type: "jsonb",
            isNullable: true,
            comment: "Feature importance scores",
          },
          {
            name: "training_data",
            type: "jsonb",
            comment: "Training dataset metadata",
          },
          {
            name: "validation_data",
            type: "jsonb",
            isNullable: true,
            comment: "Validation dataset metadata",
          },
          {
            name: "test_data",
            type: "jsonb",
            isNullable: true,
            comment: "Test dataset metadata",
          },
          {
            name: "performance_metrics",
            type: "jsonb",
            isNullable: true,
            comment: "Model performance metrics (accuracy, precision, recall, etc.)",
          },
          {
            name: "model_artifacts",
            type: "jsonb",
            comment: "Serialized model and related artifacts",
          },
          {
            name: "model_path",
            type: "varchar",
            length: "500",
            isNullable: true,
            comment: "File system or cloud storage path",
          },
          {
            name: "model_size_bytes",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "training_duration",
            type: "interval",
            isNullable: true,
          },
          {
            name: "training_started_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "training_completed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "TRAINING",
              "TRAINED",
              "VALIDATING",
              "VALIDATED",
              "DEPLOYED",
              "DEPRECATED",
              "FAILED",
              "ARCHIVED"
            ],
            default: "'TRAINING'",
          },
          {
            name: "deployment_status",
            type: "enum",
            enum: ["NOT_DEPLOYED", "STAGING", "PRODUCTION", "CANARY", "ROLLBACK"],
            default: "'NOT_DEPLOYED'",
          },
          {
            name: "deployed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "deployment_config",
            type: "jsonb",
            isNullable: true,
            comment: "Deployment configuration and environment",
          },
          {
            name: "monitoring_config",
            type: "jsonb",
            isNullable: true,
            comment: "Model monitoring and alerting configuration",
          },
          {
            name: "prediction_count",
            type: "bigint",
            default: 0,
            comment: "Total number of predictions made",
          },
          {
            name: "last_prediction_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "accuracy_score",
            type: "decimal",
            precision: 5,
            scale: 4,
            isNullable: true,
          },
          {
            name: "precision_score",
            type: "decimal",
            precision: 5,
            scale: 4,
            isNullable: true,
          },
          {
            name: "recall_score",
            type: "decimal",
            precision: 5,
            scale: 4,
            isNullable: true,
          },
          {
            name: "f1_score",
            type: "decimal",
            precision: 5,
            scale: 4,
            isNullable: true,
          },
          {
            name: "auc_score",
            type: "decimal",
            precision: 5,
            scale: 4,
            isNullable: true,
          },
          {
            name: "drift_detection_enabled",
            type: "boolean",
            default: true,
          },
          {
            name: "drift_threshold",
            type: "decimal",
            precision: 5,
            scale: 4,
            default: "0.1000",
          },
          {
            name: "last_drift_check",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "drift_detected",
            type: "boolean",
            default: false,
          },
          {
            name: "retrain_schedule",
            type: "enum",
            enum: ["MANUAL", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY"],
            default: "'MONTHLY'",
          },
          {
            name: "auto_retrain",
            type: "boolean",
            default: false,
          },
          {
            name: "last_retrain_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "next_retrain_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "parent_model_id",
            type: "uuid",
            isNullable: true,
            comment: "Previous version of the model",
          },
          {
            name: "baseline_model_id",
            type: "uuid",
            isNullable: true,
            comment: "Baseline model for comparison",
          },
          {
            name: "champion_model",
            type: "boolean",
            default: false,
            comment: "Current production champion model",
          },
          {
            name: "challenger_model",
            type: "boolean",
            default: false,
            comment: "Challenger model being tested",
          },
          {
            name: "a_b_test_config",
            type: "jsonb",
            isNullable: true,
            comment: "A/B testing configuration",
          },
          {
            name: "explainability_enabled",
            type: "boolean",
            default: true,
          },
          {
            name: "explainability_method",
            type: "enum",
            enum: ["SHAP", "LIME", "PERMUTATION", "FEATURE_IMPORTANCE", "CUSTOM"],
            isNullable: true,
          },
          {
            name: "compliance_approved",
            type: "boolean",
            default: false,
          },
          {
            name: "compliance_notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "model_risk_rating",
            type: "enum",
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "'MEDIUM'",
          },
          {
            name: "tags",
            type: "jsonb",
            isNullable: true,
            comment: "Model categorization tags",
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
            name: "IDX_ML_MODELS_NAME_VERSION",
            columnNames: ["model_name", "version"],
            isUnique: true,
          }),
          new Index({
            name: "IDX_ML_MODELS_TYPE",
            columnNames: ["model_type"],
          }),
          new Index({
            name: "IDX_ML_MODELS_ALGORITHM",
            columnNames: ["algorithm"],
          }),
          new Index({
            name: "IDX_ML_MODELS_STATUS",
            columnNames: ["status"],
          }),
          new Index({
            name: "IDX_ML_MODELS_DEPLOYMENT_STATUS",
            columnNames: ["deployment_status"],
          }),
          new Index({
            name: "IDX_ML_MODELS_CHAMPION",
            columnNames: ["champion_model"],
          }),
          new Index({
            name: "IDX_ML_MODELS_CHALLENGER",
            columnNames: ["challenger_model"],
          }),
          new Index({
            name: "IDX_ML_MODELS_PARENT_ID",
            columnNames: ["parent_model_id"],
          }),
          new Index({
            name: "IDX_ML_MODELS_BASELINE_ID",
            columnNames: ["baseline_model_id"],
          }),
          new Index({
            name: "IDX_ML_MODELS_ACCURACY",
            columnNames: ["accuracy_score"],
          }),
          new Index({
            name: "IDX_ML_MODELS_DRIFT_DETECTED",
            columnNames: ["drift_detected"],
          }),
          new Index({
            name: "IDX_ML_MODELS_NEXT_RETRAIN",
            columnNames: ["next_retrain_at"],
          }),
          new Index({
            name: "IDX_ML_MODELS_COMPLIANCE",
            columnNames: ["compliance_approved"],
          }),
          new Index({
            name: "IDX_ML_MODELS_RISK_RATING",
            columnNames: ["model_risk_rating"],
          }),
          new Index({
            name: "IDX_ML_MODELS_CREATED_AT",
            columnNames: ["created_at"],
          }),
        ],
        foreignKeys: [
          new ForeignKey({
            name: "FK_ML_MODELS_PARENT_MODEL_ID",
            columnNames: ["parent_model_id"],
            referencedTableName: "ml_models",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
          }),
          new ForeignKey({
            name: "FK_ML_MODELS_BASELINE_MODEL_ID",
            columnNames: ["baseline_model_id"],
            referencedTableName: "ml_models",
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
      CREATE TRIGGER update_ml_models_updated_at 
      BEFORE UPDATE ON ml_models 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to manage champion/challenger models
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION manage_champion_challenger()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Only one champion model per model type
        IF NEW.champion_model = true THEN
          UPDATE ml_models 
          SET champion_model = false 
          WHERE model_type = NEW.model_type 
            AND champion_model = true 
            AND id != NEW.id;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER manage_champion_challenger_trigger
      BEFORE UPDATE OF champion_model ON ml_models
      FOR EACH ROW
      WHEN (NEW.champion_model = true)
      EXECUTE FUNCTION manage_champion_challenger();
    `);

    -- Create function to calculate next retrain date
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_next_retrain_date()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.auto_retrain = true AND NEW.next_retrain_at IS NULL THEN
          NEW.next_retrain_at := CASE NEW.retrain_schedule
            WHEN 'DAILY' THEN CURRENT_TIMESTAMP + INTERVAL '1 day'
            WHEN 'WEEKLY' THEN CURRENT_TIMESTAMP + INTERVAL '1 week'
            WHEN 'MONTHLY' THEN CURRENT_TIMESTAMP + INTERVAL '1 month'
            WHEN 'QUARTERLY' THEN CURRENT_TIMESTAMP + INTERVAL '3 months'
            ELSE NULL
          END;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER set_next_retrain_date_trigger
      BEFORE INSERT OR UPDATE OF auto_retrain, retrain_schedule ON ml_models
      FOR EACH ROW
      EXECUTE FUNCTION set_next_retrain_date();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_next_retrain_date_trigger ON ml_models`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS manage_champion_challenger_trigger ON ml_models`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_ml_models_updated_at ON ml_models`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_next_retrain_date`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS manage_champion_challenger`);
    await queryRunner.dropTable("ml_models");
  }
}