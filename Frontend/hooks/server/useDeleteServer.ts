import { useState } from "react";
import { deleteServer } from "@/ApiManager/apiMethods";
import useGetServers from "@/hooks/server/useGetServers";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

////////////////////////////////////////////////////////////////////////////

const useDeleteServer = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { serverID } = useParams<{ serverID: string; spaceID: string }>();

  const searchParam = {
    type: "joined",
  };
  const { mutate: mutateServers } = useGetServers(searchParam);

  const handleDeleteServer = async () => {
    setLoading(true);

    try {
      await deleteServer(serverID);
      router.push(`/servers`);
      mutateServers();
      toast.success("Server deleted successfully");
      return null;
    } catch (err) {
      toast.error("Something went wrong while deleting the server");
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDeleteServer };
};

export default useDeleteServer;
