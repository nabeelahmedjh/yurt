import { useState } from "react";
import { createServer } from "@/ApiManager/apiMethods";
import useGetServers from "@/hooks/server/useGetServers";
import { useSearchParams } from "next/navigation";

const useCreateServer = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const { mutate: mutateJoined } = useGetServers({
    type: "joined",
  });

  const { mutate: mutateAll } = useGetServers(
    {
      type: "all",
      search: searchParams.get("search") || "",
      tags: searchParams.get("tags") || "",
      limit: 10,
    },
    true
  );

  const handleCreateServer = async (data: any) => {
    setLoading(true);

    try {
      await createServer(data);
      mutateJoined();
      mutateAll();
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
