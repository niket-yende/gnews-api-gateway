import {Response} from 'express';
import HttpStatusCodes from 'http-status-codes';
import Messages from '../helper/messages';
import Logger from '../lib/logger';
import HttpError from './http-error';

class ErrorHandler {
  public static async handleError(error: Error, response?: Response): Promise<void> {
    Logger.error(error.stack ? error.stack : error.message);
    if (response) {
      if (error instanceof HttpError) {
        response.status(error.status).json(error.body);
      } else if (error instanceof SyntaxError) {
        response.status(HttpStatusCodes.BAD_REQUEST).
            json({message: 'Invalid request'});
      } else {
        response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).
            json(Messages.unknownError);
      }
    } else {
      Logger.alert(`Unhandled error - ${error.stack || error.message}`);
    }
  }
}

export default ErrorHandler;
