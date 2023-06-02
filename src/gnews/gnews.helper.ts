import axios from 'axios';
import config from 'config';
import Logger from '../lib/logger';
import HttpError from '../error/http-error';
import httpStatusCodes from 'http-status-codes';
import Messages from '../helper/messages';

/**
 * Axios api call method to fetch gnews data
 * @param {unknown} query
 * @return {any}
 */
export async function apiCall(query: unknown) {
  Logger.debug('gnews.helper: Invoking the apiCall method');
  Logger.debug(`gnews url: ${config.get('microservices.gnewsApi.url')}`);
  const axiosConfig = {
    method: 'get',
    url: `${config.get('microservices.gnewsApi.url')}`,
    params: query,
  };

  const response = await axios(axiosConfig)
      .catch((err) => {
        Logger.error(`Error caught while making api call to gnews: ${err}`);
        Logger.debug(err.response.data);
        throw new HttpError(httpStatusCodes.BAD_REQUEST, {
          code: Messages.dataValidations.code,
          message: err.response.data.errors,
        });
      });
  Logger.debug(`Api call response status: ${response.status}`);
  Logger.debug(`Api call output: ${JSON.stringify(response.data)}`);
  return response.data;
}
