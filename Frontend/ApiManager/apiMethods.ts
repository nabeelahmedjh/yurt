import APIManager from "./apiManager";
import ENDPOINTS from "./endpoints";

const createServer = async (data: any) => {
  const url = ENDPOINTS.SERVERS;
  return APIManager.post(url, data, {}, true);
};

const createSpace = async (serverId: string, data: any) => {
  const url = ENDPOINTS.SPACES(serverId);
  return APIManager.post(url, data, {}, true);
};

const createMessage = async (spaceId: string, data: any) => {
  const url = ENDPOINTS.MESSAGES(spaceId);
  return APIManager.post(url, data, {}, true);
};

const getServers = async (params: {}) => {
  const url = ENDPOINTS.SERVERS;
  return APIManager.get(url, params, {}, true);
};

const getMessages = async (spaceId: string) => {
  const url = ENDPOINTS.MESSAGES(spaceId);
  return APIManager.get(url, {}, {}, true);
};

const getProfile = async () => {
  const url = ENDPOINTS.PROFILE;
  return APIManager.get(url, {}, {}, true);
};

const login = async (data: any) => {
  const url = ENDPOINTS.LOGIN;
  return APIManager.post(url, data, {}, false);
};

const signup = async (data: any) => {
  const url = ENDPOINTS.SIGNUP;
  return APIManager.post(url, data, {}, false);
};

export {
  createServer,
  createSpace,
  createMessage,
  getServers,
  getMessages,
  getProfile,
  login,
  signup,
};
