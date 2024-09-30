import { useState } from "react";
import { deleteSpace } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

////////////////////////////////////////////////////////////////////////////

const useDeleteSpace = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { serverID } = useParams<{ serverID: string; spaceID: string }>();

  const { mutate: mutateServerById } = useGetServerById();

  const handleDeleteSpace = async (spaceId: string) => {
    setLoading(true);

    try {
      await deleteSpace(spaceId);
      router.push(`/servers/${serverID}`);
      mutateServerById();
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
