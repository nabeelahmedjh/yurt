const ENDPOINTS = {
    SERVERS: `/servers`,
    SPACES: (serverId: string) => `/servers/${serverId}/spaces`,
    MESSAGES: (spaceId: string) => `/spaces/${spaceId}/messages`,
    PROFILE: `/auth/profile`,
    LOGIN:  `/auth/login`,
    SIGNUP: `/auth/signup`,
  };
  
  export default ENDPOINTS;
  