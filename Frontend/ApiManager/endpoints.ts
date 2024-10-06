const ENDPOINTS = {
  SERVERS: `/servers`,
  SERVER: (serverId: string) => `/servers/${serverId}`,
  JOIN_SERVER: (serverId: string) => `/servers/${serverId}/join`,
  JOIN_SERVER_INVITECODE: (inviteCode: string) => `/servers/join/${inviteCode}`,
  SPACES: (serverId: string) => `/servers/${serverId}/spaces`,
  INVITE: (serverId: string) => `/servers/${serverId}/invite`,
  SPACE: (spaceId: string) => `/spaces/${spaceId}`,
  JOIN_SPACE: (spaceId: string) => `/spaces/${spaceId}/join`,
  MESSAGES: (spaceId: string) => `/spaces/${spaceId}/messages`,
  PROFILE: `/users/me/profile`,
  PROFILE_AVATAR: `/users/me/profile/avatar`,
  LOGIN: `/auth/login`,
  SIGNUP: `/auth/signup`,
  TAGS: `/tags`,
  USERS: `/users`,
};

export default ENDPOINTS;
