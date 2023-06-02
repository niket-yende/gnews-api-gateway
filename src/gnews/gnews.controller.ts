/* eslint-disable linebreak-style */
import httpStatusCodes from 'http-status-codes';
import {IRouter, Router, Request, Response, NextFunction} from 'express';
import GnewsService from './gnews.service';
import ValidationMiddleware, {RequestProperty} from '../middleware/validation';
import GetGnewsDto from './dto/get-gnews.dto';
import {cache} from '../middleware/cache';

export default class GnewsController {
  public path = 'gnews';
  public router: IRouter;

  private readonly gnewsService: GnewsService;

  constructor(gnewsService: GnewsService) {
    // eslint-disable-next-line new-cap
    this.router = Router();
    this.gnewsService = gnewsService;
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get(
        '/search',
        // ValidationMiddleware.validateDto(RequestProperty.QUERY, GetGnewsDto, true),
        cache(1000),
        this.fetchGnewsData.bind(this)
    );
  }

  /**
   * post echo
   * @param {express.Request} request
   * @param {express.Response} response
   * @param {express.Response} next
   */
  private async fetchGnewsData(request: Request, response: Response, next: NextFunction)
  : Promise<void> {
    try {
      const apiKey = request.headers['api-key'] as string;
      const getGnewsDto: GetGnewsDto = request.query as any;
      const result = await this.gnewsService.fetchGnewsData(
          getGnewsDto, apiKey
      );
      response.status(httpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
