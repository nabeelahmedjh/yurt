import { useState } from "react";
import { updateServer } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";

import { useParams } from "next/navigation";

const useUpdateServer = () => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params?.serverID;
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetServerById();

  const handleUpdateServer = async (data: any) => {
    setLoading(true);

    try {
      await updateServer(serverId, data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleUpdateServer };
};

export default useUpdateServer;
