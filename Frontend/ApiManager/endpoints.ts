const ENDPOINTS = {
  SERVERS: `/servers`,
  SPACES: (serverId: string) => `/servers/${serverId}/spaces`,
  MESSAGES: (spaceId: string) => `/spaces/${spaceId}/messages`,
  PROFILE: `/users/me/profile`,
  PROFILE_AVATAR: `/users/me/profile/avatar`,
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/signup`,
  TAGS: `/tags`,
  USERS: `/users`,
};

export default ENDPOINTS;
