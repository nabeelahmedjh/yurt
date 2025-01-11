import { useState } from "react";
import { useParams } from "next/navigation";
import { updateServer } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";
import useGetServers from "@/hooks/server/useGetServers";

const useUpdateServer = () => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params?.serverID;
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetServerById();
  const { mutate: mutateJoined } = useGetServers({
    type: "joined",
  });

  const handleUpdateServer = async (data: any) => {
    setLoading(true);

    try {
      await updateServer(serverId, data);
      mutate();
      mutateJoined();
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
