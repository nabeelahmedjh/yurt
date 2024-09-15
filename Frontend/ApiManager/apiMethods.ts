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

const updateAvatar = async (data: any) => {
  const url = ENDPOINTS.PROFILE_AVATAR;
  return APIManager.patch(url, data, {}, true);
};

const updateProfile = async (data: any) => {
  const url = ENDPOINTS.PROFILE;
  return APIManager.put(url, data, {}, true);
};

const updateServer = async (serverId: string, data: any) => {
  const url = ENDPOINTS.SERVER(serverId);
  return APIManager.put(url, data, {}, true);
};

const joinServer = async (serverId: string) => {
  const url = ENDPOINTS.JOIN_SERVER(serverId);
  return APIManager.put(url, {}, {}, true);
};

const updateSpace = async (spaceId: string, data: any) => {
  const url = ENDPOINTS.SPACE(spaceId);
  return APIManager.put(url, data, {}, true);
};

const deleteSpace = async (spaceId: string) => {
  const url = ENDPOINTS.SPACE(spaceId);
  return APIManager.delete(url, {}, {}, true);
};

const deleteServer = async (serverId: string) => {
  const url = ENDPOINTS.SERVER(serverId);
  return APIManager.delete(url, {}, {}, true);
};

const getServers = async (params: {}) => {
  const url = ENDPOINTS.SERVERS;
  return APIManager.get(url, params, {}, true);
};

const getServerById = async (serverId: string) => {
  const url = ENDPOINTS.SERVER(serverId);
  return APIManager.get(url, {}, {}, true);
};

const getMessages = async (spaceId: string, params: {}) => {
  const url = ENDPOINTS.MESSAGES(spaceId);
  return APIManager.get(url, params, {}, true);
};

const getUsers = async (params: {}) => {
  const url = ENDPOINTS.USERS;
  return APIManager.get(url, params, {}, true);
};

const getProfile = async () => {
  const url = ENDPOINTS.PROFILE;
  return APIManager.get(url, {}, {}, true);
};

const getTags = async () => {
  const url = ENDPOINTS.TAGS;
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
  updateAvatar,
  updateProfile,
  updateServer,
  joinServer,
  updateSpace,
  deleteSpace,
  deleteServer,
  getServers,
  getServerById,
  getMessages,
  getUsers,
  getProfile,
  getTags,
  login,
  signup,
};
