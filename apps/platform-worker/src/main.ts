import { WorkerApp } from './worker-app';

async function main() {
  console.log('Starting Workestra Platform Worker...');

  const worker = new WorkerApp();
  await worker.initialize();
  await worker.start();

  console.log('Workestra Platform Worker is running');

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    await worker.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error('Worker failed to start:', error);
  process.exit(1);
});
