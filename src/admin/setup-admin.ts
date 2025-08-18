import { INestApplication } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AmlAlert } from '../entities/aml-alert.entity';

export async function setupAdmin(app: INestApplication): Promise<void> {
  try {
    const { default: AdminJS } = await import('adminjs');
    // @ts-ignore - TypeScript module resolution issue with AdminJS packages
    const typeormAdapter = await import('@adminjs/typeorm');
    // @ts-ignore - TypeScript module resolution issue with AdminJS packages
    const expressAdapter = await import('@adminjs/express');
    
    // Register TypeORM adapter
    AdminJS.registerAdapter({
      Resource: typeormAdapter.Resource,
      Database: typeormAdapter.Database,
    });

    const adminOptions = {
      resources: [User, AmlAlert],
      rootPath: '/admin',
      branding: {
        companyName: 'JoonaPay AML Manager',
        logo: false as const,
        softwareBrothers: false,
      },
    };

    const admin = new AdminJS(adminOptions);
    
    const DEFAULT_ADMIN = {
      email: 'admin@joonapay.com',
      password: 'admin123',
    };

    const authenticate = async (email: string, password: string) => {
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
      }
      return null;
    };

    const adminRouter = expressAdapter.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'secret-joonapay-2024',
      },
      null,
      {
        resave: false,
        saveUninitialized: true,
        secret: 'secret-joonapay-session-2024',
      }
    );

    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(admin.options.rootPath, adminRouter);
  } catch (error) {
    console.error('AdminJS setup failed:', error);
    throw error;
  }
}