import { useState } from 'react';
import { createSpace } from '@/ApiManager/apiMethods';

interface SpaceData {
  name: string;
  description: string;
}

const useCreateSpace = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateSpace = async (serverId: string, data: SpaceData) => {
    setLoading(true);

    try {
      await createSpace(serverId, data);
      return null;
    } catch (err) {

      return (err as Error).message || "An error occurred";
     
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreateSpace };
};

export default useCreateSpace;
