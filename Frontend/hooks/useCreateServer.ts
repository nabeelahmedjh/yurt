import { useState } from "react";
import { createServer } from "@/ApiManager/apiMethods";
import useGetServers from "@/hooks/useGetServers";

interface ServerData {
  name: string;
  description: string;
}

const useCreateServer = () => {
  const [loading, setLoading] = useState(false);
  const searchParam = {
    type: "joined",
  };
  const { mutate } = useGetServers(searchParam);

  const handleCreateServer = async (data: ServerData) => {
    setLoading(true);

    try {
      await createServer(data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreateServer };
};

export default useCreateServer;
