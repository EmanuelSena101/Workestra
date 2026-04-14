import { NotificationJob } from './jobs/notifications/notification-job';
import { IndexingJob } from './jobs/indexing/indexing-job';
import { DatasetSyncJob } from './jobs/datasets/dataset-sync-job';
import { WorkflowTimerJob } from './jobs/workflows/workflow-timer-job';
import { IntegrationWebhookJob } from './jobs/integrations/integration-webhook-job';
import { SchedulerManager } from './schedulers/scheduler-manager';

export class WorkerApp {
  private notificationJob: NotificationJob;
  private indexingJob: IndexingJob;
  private datasetSyncJob: DatasetSyncJob;
  private workflowTimerJob: WorkflowTimerJob;
  private integrationWebhookJob: IntegrationWebhookJob;
  private schedulerManager: SchedulerManager;

  constructor() {
    this.notificationJob = new NotificationJob();
    this.indexingJob = new IndexingJob();
    this.datasetSyncJob = new DatasetSyncJob();
    this.workflowTimerJob = new WorkflowTimerJob();
    this.integrationWebhookJob = new IntegrationWebhookJob();
    this.schedulerManager = new SchedulerManager();
  }

  async initialize() {
    console.log('Initializing worker jobs...');
    // TODO: Connect to Redis for Bull queues
    // TODO: Connect to PostgreSQL for job state
    // TODO: Connect to MinIO for file processing
    // TODO: Connect to OpenSearch for indexing
  }

  async start() {
    console.log('Starting job processors...');

    // Start all job processors
    await this.notificationJob.start();
    await this.indexingJob.start();
    await this.datasetSyncJob.start();
    await this.workflowTimerJob.start();
    await this.integrationWebhookJob.start();

    // Start scheduled jobs
    this.schedulerManager.start();

    console.log('All job processors started');
  }

  async stop() {
    console.log('Stopping job processors...');

    this.schedulerManager.stop();
    await this.notificationJob.stop();
    await this.indexingJob.stop();
    await this.datasetSyncJob.stop();
    await this.workflowTimerJob.stop();
    await this.integrationWebhookJob.stop();

    console.log('All job processors stopped');
  }
}
