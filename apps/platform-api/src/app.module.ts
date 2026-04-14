import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { RequestsModule } from './modules/requests/requests.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { FormsModule } from './modules/forms/forms.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    UsersModule,
    PermissionsModule,
    TasksModule,
    RequestsModule,
    WorkflowsModule,
    FormsModule,
    DocumentsModule,
    DatasetsModule,
    IntegrationsModule,
    NotificationsModule,
    SearchModule,
    AuditModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
