import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HomeModule } from './modules/home/home.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { RequestsModule } from './modules/requests/requests.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { FormsModule } from './modules/forms/forms.module';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { KanbanModule } from './modules/kanban/kanban.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HomeModule,
    TasksModule,
    RequestsModule,
    DocumentsModule,
    WorkflowsModule,
    FormsModule,
    DatasetsModule,
    NotificationsModule,
    SearchModule,
    PermissionsModule,
    AuditModule,
    AdminModule,
    IntegrationsModule,
    KanbanModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
