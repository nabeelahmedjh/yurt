import { useState } from "react";
import { createSpace } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";

interface SpaceData {
  name: string;
  description: string;
}

const useCreateSpace = () => {
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetServerById();

  const handleCreateSpace = async (serverId: string, data: SpaceData) => {
    setLoading(true);

    try {
      await createSpace(serverId, data);
      mutate();
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
