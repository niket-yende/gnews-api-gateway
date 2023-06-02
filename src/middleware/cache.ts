import {Request, Response, NextFunction} from 'express';
import mcache from 'memory-cache';
import Logger from '../lib/logger';

export const cache = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req.originalUrl || req.url);
    const cachedBody = mcache.get(key);
    if (cachedBody) {
      Logger.debug(`Cached url found for key: ${key}`);
      res.send(cachedBody);
      return;
    } else {
      Logger.debug(`No cached url found for key: ${key}`);
      const response = res as any;
      response.sendResponse = res.send;
      response.send = (body: any) => {
        Logger.debug(`Putting ${key} into mcache`);
        mcache.put(key, JSON.parse(body), duration * 1000);
        response.sendResponse(body);
      };
      next();
    }
  };
};
