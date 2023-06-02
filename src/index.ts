/* eslint-disable linebreak-style */
import * as http from 'http';
import config from 'config';
import App from './app';
import Logger from './lib/logger';
import ErrorHandler from './error/error-handler';

const port = config.get('port');
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.setTimeout(parseInt(config.get('serverTimeoutSeconds'))*1000);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      Logger.error(`${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function onListening(): Promise<void> {
  Logger.info(`Listening on ${port}`);
}

process.on('uncaughtException', (error:Error) => {
  ErrorHandler.handleError(error);
  // Logger.error(error);
});

process.on('unhandledRejection', (reason: string) => {
  ErrorHandler.handleError(new Error(reason));
  // Logger.error(reason);
});

