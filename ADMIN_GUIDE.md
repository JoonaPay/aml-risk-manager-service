# AdminJS Integration for AML Risk Manager

## Overview

This service includes a comprehensive AdminJS-powered administration panel for managing all AML (Anti-Money Laundering) operations. AdminJS provides a beautiful, auto-generated admin interface that makes it easy to manage your risk profiles, alerts, monitoring rules, and ML models.

## 🚀 Quick Start

### Access the Admin Panel
1. Start the service: `npm run start:dev`
2. Navigate to: `http://localhost:3004/admin`
3. Login with:
   - **Username**: `admin@joonapay.com`
   - **Password**: `admin123`

## 📊 Dashboard Features

### Main Dashboard
- **Real-time Statistics**: View key metrics and KPIs
- **Risk Distribution**: Visual breakdown of risk levels across all profiles
- **Alert Trends**: Historical alert patterns and trends
- **System Health**: Monitor external API status and ML model deployment

### Resource Management

#### 🎯 Risk Profiles
- **View/Edit**: Comprehensive risk profile management
- **Custom Actions**:
  - `Recalculate Risk`: Instantly recalculate risk scores using latest ML models
- **Filters**: Filter by entity type, risk level, KYC level, PEP status
- **Properties**:
  - Entity information and identification
  - Risk scoring and level classification
  - KYC and compliance status
  - Geographic and industry risk factors
  - ML-generated insights

#### 🚨 AML Alerts
- **Alert Management**: Complete alert lifecycle management
- **Custom Actions**:
  - `Assign to Me`: Quick assignment of alerts to current user
  - `Resolve Alert`: Mark alerts as resolved with timestamp
- **Status Tracking**: Open, In Progress, Escalated, Resolved, False Positive
- **Severity Levels**: Low, Medium, High, Very High, Critical
- **Investigation Notes**: Add and track investigation progress

#### 📊 Transaction Monitoring Rules
- **Rule Configuration**: Manage all monitoring rules and thresholds
- **Custom Actions**:
  - `Activate Rule`: Enable monitoring rules with effective date
  - `Deactivate Rule`: Disable rules with expiration date
- **Rule Types**: Threshold, Pattern, Velocity, Geographic, Time-based, ML-based, Sanctions, PEP
- **Priority Management**: Critical, High, Medium, Low priority levels

#### 🤖 ML Models
- **Model Management**: Deploy and manage machine learning models
- **Custom Actions**:
  - `Deploy Model`: Deploy models to production with endpoint configuration
  - `Test Model`: Run model performance tests and view metrics
- **Model Types**: Risk Scoring, Anomaly Detection, Pattern Recognition, Classification
- **Performance Tracking**: Accuracy, Precision, Recall, F1-Score monitoring

## 🔧 Advanced Features

### Bulk Operations
AdminJS supports powerful bulk operations for efficiency:

#### Bulk Risk Assessment
- Select multiple risk profiles
- Recalculate risk scores using latest models and data
- View detailed results and changes
- Automatic audit trail

#### Bulk Alert Assignment
- Assign multiple alerts to investigators
- Automatic status updates to "In Progress"
- Bulk investigation note addition

#### Compliance Data Export
- Export selected records to CSV or JSON
- Compliance-ready formatting
- Automatic filename generation with timestamps

### Custom Components

#### Risk Analytics Dashboard
- Interactive charts and graphs
- Real-time data visualization
- Key performance indicators
- System health monitoring

### Authentication & Security
- Simple email/password authentication (demo)
- Session management with secure cookies
- Role-based access control ready
- Audit logging for all actions

## 🛠️ Configuration

### Environment Variables
```bash
# Admin Panel Configuration
ADMIN_COOKIE_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Database Connection (required for AdminJS)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=aml_risk_manager
```

### Customization Options

#### Branding
The admin panel is branded for JoonaPay with:
- Custom company name and logo
- JoonaPay color scheme
- Custom favicon support

#### Navigation
Organized into logical sections:
- 🎯 **Risk Management**: Risk profiles and assessments
- 🚨 **Alert Management**: Alert handling and investigation
- 📊 **Configuration**: Rules and system settings
- 🤖 **AI/ML Models**: Machine learning model management

## 📈 Analytics & Reporting

### Built-in Analytics
- **Risk Distribution**: Visual breakdown by risk levels
- **Alert Trends**: Time-series analysis of alert patterns
- **Performance Metrics**: ML model accuracy and performance
- **System Health**: External API and service status

### Export Capabilities
- **CSV Export**: Compliance-ready data export
- **JSON Export**: API-friendly data format
- **Bulk Operations**: Export multiple records at once
- **Custom Formatting**: Automatic field formatting and validation

## 🔐 Production Considerations

### Security Hardening
For production deployment:

1. **Change Default Credentials**:
   ```typescript
   // In admin.module.ts
   authenticate: async (email: string, password: string) => {
     // Integrate with your actual authentication system
     // Use environment variables for credentials
     // Implement proper password hashing
   }
   ```

2. **Use Environment Secrets**:
   ```bash
   ADMIN_COOKIE_SECRET=generate-random-secret-key
   SESSION_SECRET=generate-random-session-secret
   ```

3. **Enable HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Configure appropriate rate limits
5. **Audit Logging**: Enable comprehensive audit trails

### Database Integration
AdminJS automatically works with your TypeORM entities:
- No additional configuration needed
- Automatic form generation
- Built-in validation
- Relationship handling

### Performance Optimization
- **Pagination**: Automatic pagination for large datasets
- **Caching**: Built-in query caching
- **Lazy Loading**: Efficient data loading
- **Indexing**: Ensure proper database indexes

## 🆘 Troubleshooting

### Common Issues

#### AdminJS Not Loading
- Check TypeScript configuration (`moduleResolution: "node16"`)
- Verify all dependencies are installed
- Check browser console for errors

#### Authentication Issues
- Verify credentials in authenticate function
- Check cookie/session configuration
- Clear browser cache and cookies

#### Database Connection
- Ensure TypeORM entities are properly imported
- Check database connection configuration
- Verify entity relationships

### Debug Mode
Enable debug logging:
```typescript
// In admin.module.ts
adminJsOptions: {
  // ... other options
  rootPath: '/admin',
  debug: process.env.NODE_ENV === 'development',
}
```

## 🔄 Updates & Maintenance

### Updating AdminJS
```bash
npm update adminjs @adminjs/nestjs @adminjs/typeorm
```

### Adding New Resources
1. Create TypeORM entity
2. Add to AdminJS resources array
3. Configure properties and actions
4. Test CRUD operations

### Custom Actions
Create custom actions for specific business logic:
```typescript
{
  'custom-action': {
    actionType: 'record',
    icon: 'CustomIcon',
    handler: async (request, response, context) => {
      // Custom logic here
    },
  },
}
```

## 📚 Additional Resources

- [AdminJS Documentation](https://docs.adminjs.co/)
- [AdminJS NestJS Plugin](https://docs.adminjs.co/installation/plugins/nest)
- [AdminJS TypeORM Adapter](https://docs.adminjs.co/installation/adapters/typeorm)
- [AdminJS Customization Guide](https://docs.adminjs.co/basics/customizing-resources)

## 🎯 Next Steps

1. **Integrate Real Authentication**: Replace demo auth with your actual auth system
2. **Add Role-Based Access**: Implement different permission levels
3. **Custom Dashboards**: Create role-specific dashboards
4. **Advanced Analytics**: Add more sophisticated reporting
5. **Audit Trail**: Implement comprehensive audit logging
6. **API Integration**: Connect to external compliance systems

The AdminJS integration provides a powerful, user-friendly interface for managing all aspects of your AML operations while maintaining the clean architecture and patterns established in your NestJS application.