import axios from 'axios';
import config from 'config';
import Logger from '../lib/logger';

export async function apiCall(queryString: string) {
  Logger.debug('gnews.helper: Invoking the apiCall method');
  Logger.debug(`gnews url: ${config.get('microservices.gnewsApi.url')}`);
  const axiosConfig = {
    method: 'get',
    url: `${config.get('microservices.gnewsApi.url')}?${queryString}`,
  };

  const response = await axios(axiosConfig)
      .catch((err) => {
        Logger.error(`Error caught while making api call to gnews: ${err}`);
        throw new Error(err);
      });
  Logger.debug(`Api call response status: ${response.status}`);
  Logger.debug(`Api call output: ${JSON.stringify(response.data)}`);
  return response.data;
}
