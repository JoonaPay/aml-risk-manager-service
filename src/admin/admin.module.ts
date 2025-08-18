import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJSService {
  private readonly logger = new Logger(AdminJSService.name);
  
  constructor(private configService: ConfigService) {}

  async setupAdminJS(app: any): Promise<void> {
    // Try dynamic import for AdminJS v7 ESM modules
    const AdminJS = (await eval('import("adminjs")')).default;
    const AdminJSNestJS = await eval('import("@adminjs/nestjs")');
    const AdminJSTypeOrm = await eval('import("@adminjs/typeorm")');
    
    const { UserOrmEntity } = await import('../modules/user/infrastructure/orm-entities/user.orm-entity');
    const { AmlAlertOrmEntity } = await import('../modules/aml-alert/infrastructure/orm-entities/aml-alert.orm-entity');
    
    // Register the TypeORM adapter
    AdminJS.registerAdapter({
      Database: AdminJSTypeOrm.Database,
      Resource: AdminJSTypeOrm.Resource,
    });

    const DEFAULT_ADMIN = {
      email: 'admin@joonapay.com',
      password: 'admin123',
      role: 'admin',
    };

    const authenticate = async (email: string, password: string) => {
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
      }
      return null;
    };

    const adminJsOptions = {
      rootPath: '/admin',
      branding: {
        companyName: 'JoonaPay AML Risk Manager',
        softwareBrothers: false,
      },
      resources: [
        {
          resource: UserOrmEntity,
          options: {
            parent: {
              name: 'User Management',
              icon: 'User',
            },
            listProperties: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
            showProperties: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt'],
            editProperties: ['email', 'firstName', 'lastName', 'role', 'isActive'],
            filterProperties: ['email', 'firstName', 'lastName', 'role', 'isActive'],
            properties: {
              id: {
                isVisible: { list: true, filter: false, show: true, edit: false },
              },
              email: {
                isRequired: true,
                type: 'email',
              },
              firstName: {
                isRequired: true,
              },
              lastName: {
                isRequired: true,
              },
              role: {
                availableValues: [
                  { value: 'admin', label: 'Administrator' },
                  { value: 'compliance_officer', label: 'Compliance Officer' },
                  { value: 'analyst', label: 'Risk Analyst' },
                  { value: 'viewer', label: 'Viewer' },
                ],
              },
              isActive: {
                type: 'boolean',
              },
              createdAt: {
                isVisible: { list: true, filter: true, show: true, edit: false },
              },
              updatedAt: {
                isVisible: { list: false, filter: false, show: true, edit: false },
              },
            },
          },
        },
        {
          resource: AmlAlertOrmEntity,
          options: {
            parent: {
              name: 'AML Monitoring',
              icon: 'Shield',
            },
            listProperties: ['id', 'entityId', 'alertType', 'riskLevel', 'status', 'createdAt'],
            showProperties: ['id', 'entityId', 'alertType', 'riskLevel', 'description', 'status', 'metadata', 'createdAt', 'updatedAt'],
            editProperties: ['entityId', 'alertType', 'riskLevel', 'description', 'status', 'metadata'],
            filterProperties: ['alertType', 'riskLevel', 'status', 'entityId'],
            properties: {
              id: {
                isVisible: { list: true, filter: false, show: true, edit: false },
              },
              entityId: {
                isRequired: true,
              },
              alertType: {
                isRequired: true,
                availableValues: [
                  { value: 'suspicious_transaction', label: 'Suspicious Transaction' },
                  { value: 'high_risk_customer', label: 'High Risk Customer' },
                  { value: 'unusual_pattern', label: 'Unusual Pattern' },
                  { value: 'sanctions_screening', label: 'Sanctions Screening' },
                  { value: 'pep_screening', label: 'PEP Screening' },
                  { value: 'threshold_breach', label: 'Threshold Breach' },
                ],
              },
              riskLevel: {
                isRequired: true,
                availableValues: [
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ],
              },
              description: {
                type: 'textarea',
                isRequired: true,
              },
              status: {
                availableValues: [
                  { value: 'open', label: 'Open' },
                  { value: 'under_review', label: 'Under Review' },
                  { value: 'escalated', label: 'Escalated' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'false_positive', label: 'False Positive' },
                  { value: 'closed', label: 'Closed' },
                ],
              },
              metadata: {
                type: 'mixed',
                isVisible: { list: false, filter: false, show: true, edit: true },
              },
              createdAt: {
                isVisible: { list: true, filter: true, show: true, edit: false },
              },
              updatedAt: {
                isVisible: { list: false, filter: false, show: true, edit: false },
              },
            },
          },
        },
      ],
    };

    const adminOptions = {
      auth: {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: this.configService.get('SESSION_SECRET', 'secret-longer-password-to-secure-session'),
      },
      sessionOptions: {
        resave: false,
        saveUninitialized: false,
        secret: this.configService.get('SESSION_SECRET', 'secret-longer-password-to-secure-session'),
      },
    };

    // Create AdminJS instance
    const adminJs = new AdminJS(adminJsOptions);
    
    // Use AdminJS Express plugin to build router
    const adminRouter = AdminJSNestJS.AdminModule.buildRouter(adminJs, adminOptions);
    app.use(adminJs.options.rootPath, adminRouter);
    
    this.logger.log('✅ AdminJS v7 setup completed successfully');
  }
}