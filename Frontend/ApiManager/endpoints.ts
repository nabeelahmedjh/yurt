const ENDPOINTS = {
    SERVERS: `/servers`,
    SPACES: (serverId: string) => `/servers/${serverId}/spaces`,
  };
  
  export default ENDPOINTS;
  