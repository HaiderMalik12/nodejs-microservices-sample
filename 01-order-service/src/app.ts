import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import http from 'http';
import { mongoDBconnection } from '@order/config/connect';
import globalErrorHandler from '@order/middlewares/globalError';
import { appRoutes } from '@order/middlewares/routesMiddlewares';
import { standardMiddlewares } from '@order/middlewares/standardMiddlewars';
import { notFoundError } from '@order/middlewares/notFoundError';
import { connectRabbitMQ } from '@order/config/rabbitmq'

// Establish MongoDB connection
mongoDBconnection();

//RabbitMQ Connection
connectRabbitMQ().then(() => { console.log('connected to rabbitMQ') }).catch(console.error)

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