import APIManager from './apiManager';
import ENDPOINTS from './endpoints';

const createServer = async (data: any) => {
  const url = ENDPOINTS.SERVERS;
  return APIManager.post(url, data, {}, true);
};

const createSpace = async (serverId: string, data: any) => {
  const url = ENDPOINTS.SPACES(serverId);
  return APIManager.post(url, data, {}, true);
};

const getServers = async () => {
  const url = ENDPOINTS.SERVERS;
  return APIManager.get(url, {}, {}, true);
}




export { createServer, createSpace, getServers };
