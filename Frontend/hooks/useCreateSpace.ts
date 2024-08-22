import { useState } from "react";
import { createSpace } from "@/ApiManager/apiMethods";
import useGetServers from "@/hooks/useGetServers";

interface SpaceData {
  name: string;
  description: string;
}

const useCreateSpace = () => {
  const [loading, setLoading] = useState(false);
  const searchParam = {
    type: "joined",
  };
  const { mutate } = useGetServers(searchParam);

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
