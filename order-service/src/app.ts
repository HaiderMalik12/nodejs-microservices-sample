import 'dotenv/config';
import express from 'express';
import 'express-async-errors'; // Import the library
import http from 'http';
import { mongoDbconnection } from './database/connect';
import globalErrorHandler from '@logs/middlewares/globalError';
import { appRoutes } from '@logs/middlewares/routesMiddlewares';
import { standardMiddlewares } from '@logs/middlewares/standardMiddlewars';
import { notFoundError } from './middlewares/notFoundError';
import { syncDispatcherToken } from '@logs/jobs/tokens';
import cron from 'node-cron';

// Establish MongoDB connection
mongoDbconnection();

// Initialize Express app
const app = express();

// Middleware setup
standardMiddlewares(app);

// Route setup
appRoutes(app);

app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);

// Normalize and set the port
const port = normalizePort(process.env.PORT!);
app.set('port', port);

// Determine the appropriate server setup based on the environment
const server = setupHttpServer();

// Start the server
server.listen(port, async () => {
  console.log(`Node Env: ${process.env.NODE_ENV}`);
  console.log(`Server running on port: ${port}`);
});

// Event listeners for server
server.on('error', onError);

// Function to normalize a port
function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  return port >= 0 ? port : false;
}

// Error handling function
function onError(error: any) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Function to setup HTTP server
function setupHttpServer() {
  return http.createServer(app);
}
// 20th minute of every hour.
cron.schedule('20 * * * *', async () => {
  console.log('Running cron job to sync dispatcher token...');
  await syncDispatcherToken();
});
