const ENDPOINTS = {
  SERVERS: `/servers`,
  SERVER: (serverId: string) => `/servers/${serverId}`,
  SPACES: (serverId: string) => `/servers/${serverId}/spaces`,
  SPACE: (spaceId: string) => `/spaces/${spaceId}`,
  MESSAGES: (spaceId: string) => `/spaces/${spaceId}/messages`,
  PROFILE: `/users/me/profile`,
  PROFILE_AVATAR: `/users/me/profile/avatar`,
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/signup`,
  TAGS: `/tags`,
  USERS: `/users`,
};

export default ENDPOINTS;
