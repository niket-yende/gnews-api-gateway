import {Request, Response, NextFunction, RequestHandler} from 'express';
import {validationResult} from 'express-validator';
import httpStatusCodes from 'http-status-codes';
import {plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';

import Messages from '../helper/messages';
import HttpError from '../error/http-error';

export enum RequestProperty {
  BODY = 'body',
  PARAMS = 'params',
  QUERY ='query',
  HEADERS = 'headers'
}
export default class ValidationMiddleware {
  public static validate(request: Request, response: Response,
      next: NextFunction) {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(httpStatusCodes.UNPROCESSABLE_ENTITY).json({
        code: Messages.dataValidations.code,
        message: result.array()[0].msg,
      });
    }

    next();
  }


  public static validateDto<T>(requestProperty: RequestProperty, type: any,
      skipMissingProperties = false, excludeExtraneousValues = true): RequestHandler {
    const getFirstErrorMessage = (error: ValidationError) => {
      if (error.children.length > 0) {
        return error.property+'.'+getFirstErrorMessage(error.children[0]);
      } else {
        return Object.values(error.constraints)[0];
      }
    };

    return (request: Request, response: Response,
        next: NextFunction) => {
      const dto = plainToInstance(type, request[requestProperty],
          {
            excludeExtraneousValues,
            enableImplicitConversion: true,
            exposeUnsetFields: false,
          });

      validate(dto, {whitelist: true, skipMissingProperties})
          .then((errors: ValidationError[]) => {
            if (errors.length > 0 ) {
              const message = getFirstErrorMessage(errors[0]);
              next(new HttpError(httpStatusCodes.UNPROCESSABLE_ENTITY,
                  {message, code: Messages.dataValidations.code}));
            } else {
              request[requestProperty] = dto;
              next();
            }
          });
    };
  }
}
