/* eslint-disable linebreak-style */
import express, {Request, Response, NextFunction, Application} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';
import {serve, setup} from 'swagger-ui-express';

import swaggerDocument from '../swagger.json';

import GnewsService from './gnews/gnews.service';

import GnewsController from './gnews/gnews.controller';
import ErrorHandler from './error/error-handler';

class App {
  public express: Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(express.json({limit: config.get('request.jsonSizeLimit')}));
    this.express.use(express.urlencoded({extended: false}));
    // For production: dont set the contentSecurityPolicy flag
    if (process.env.NODE_ENV === 'development') {
      this.express.use(helmet({contentSecurityPolicy: false}));
    }

    this.configureCors();
  }

  private configureCors() {
    const whitelist = config.get('request.corsWhitelist').split(',');
    const corsOptions = {
      origin: (origin, callback) => {
        const pattern = /http:\/\/localhost:[0-9]{1,5}/;
        if ((process.env.NODE_ENV === 'development' && pattern.test(origin)) ||
        whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    };

    this.express.use(cors(corsOptions));
  }

  // Configure API endpoints.
  private routes(): void {
    const app = this.express;

    const URL_PREFIX = '/api/1.0';

    // Swagger UI
    app.use('/api-docs', serve, setup(swaggerDocument));

    const gnewsService = new GnewsService();

    const gnewsController = new GnewsController(gnewsService);

    app.use(`${URL_PREFIX}/${gnewsController.path}`, gnewsController.router);

    // Error handling middleware, we delegate the handling to the centralized error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
      ErrorHandler.handleError(err, res);
      // Logger.error(err);
    });
  }
}

export default new App().express;
