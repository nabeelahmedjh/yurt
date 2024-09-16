import { useState } from "react";
import { createInvite } from "@/ApiManager/apiMethods";
import useGetServerById from "./useGetServerById";
import { useParams } from "next/navigation";

const useCreateInvite = () => {
  const [loading, setLoading] = useState(false);

  const { serverID } = useParams<{ serverID: string; spaceID: string }>();

  const { mutate } = useGetServerById();

  const handleCreateInvite = async (data: any) => {
    setLoading(true);

    try {
      await createInvite(serverID, data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreateInvite };
};

export default useCreateInvite;
