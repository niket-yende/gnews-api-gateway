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
    let queryString = `q=${getGnewsDto.q}&apikey=${apiKey}`;
    if (getGnewsDto.max) {
      queryString += `&max=${getGnewsDto.max}`;
    }
    if (getGnewsDto.lang) {
      queryString += `&lang=${getGnewsDto.lang}`;
    }
    if (getGnewsDto.in) {
      queryString += `&in=${getGnewsDto.in}`;
    }
    Logger.debug(`queryString: ${queryString}`);
    const result = await apiCall(queryString);
    Logger.debug(`result: ${result}`);
    return result;
  }
}
