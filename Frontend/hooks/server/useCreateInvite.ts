import { useState } from "react";
import { createInvite } from "@/ApiManager/apiMethods";
import useGetServerById from "./useGetServerById";
import { useParams } from "next/navigation";

const useCreateInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state if needed

  const { serverID } = useParams<{ serverID: string; spaceID: string }>();
  const { mutate } = useGetServerById();

  const handleCreateInvite = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createInvite(serverID, data);
      mutate();
      return { result };
    } catch (err) {
      const errorMessage = (err as Error).message || "An error occurred";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleCreateInvite };
};

export default useCreateInvite;
