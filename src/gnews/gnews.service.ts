/* eslint-disable linebreak-style */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable security/detect-object-injection */
import httpStatusCodes from 'http-status-codes';
import Logger from '../lib/logger';
import {apiCall} from './gnews.helper';
import GetGnewsDto from './dto/get-gnews.dto';

export default class GnewsService {
  constructor() {
    // default implementation
  }

  async fetchGnewsData(getGnewsDto: GetGnewsDto, apiKey: string): Promise<any> {
    Logger.debug(`gnewsService: fetch gnews data by ${JSON.stringify(getGnewsDto)}`);
    const query = {
      ...(getGnewsDto.q && {q: getGnewsDto.q}),
      ...(getGnewsDto.max && {max: getGnewsDto.max}),
      ...(getGnewsDto.lang && {lang: getGnewsDto.lang}),
      ...(getGnewsDto.in && {in: getGnewsDto.in}),
      ...(apiKey && {apikey: apiKey}),
    };
    Logger.debug(`query: ${JSON.stringify(query)}`);
    const result = await apiCall(query);
    Logger.debug(`result: ${result}`);
    return result;
  }
}
