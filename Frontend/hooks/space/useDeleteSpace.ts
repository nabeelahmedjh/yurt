import { useState } from "react";
import { deleteSpace } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";
import useGetServers from "@/hooks/server/useGetServers";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

////////////////////////////////////////////////////////////////////////////

const useDeleteSpace = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { serverID } = useParams<{ serverID: string; spaceID: string }>();

  const { mutate: mutateServerById } = useGetServerById();
  const searchParam = {
    type: "joined",
  };
  const { mutate: mutateServers } = useGetServers(searchParam);

  const handleDeleteSpace = async (spaceId: string) => {
    setLoading(true);

    try {
      await deleteSpace(spaceId);
      router.push(`/servers/${serverID}`);
      mutateServerById();
      mutateServers();
      toast.success("Space deleted successfully");
      return null;
    } catch (err) {
      toast.error("Something went wrong while deleting the space");
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDeleteSpace };
};

export default useDeleteSpace;
