import { useState } from 'react';
import { createMessage } from '@/ApiManager/apiMethods';



const useCreateMessage = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateMessage = async (spaceId: string, data: any) => {
    setLoading(true);

    try {
      await createMessage(spaceId, data);
      return null;
    } catch (err) {

      return (err as Error).message || "An error occurred";
     
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreateMessage };
};

export default useCreateMessage;
