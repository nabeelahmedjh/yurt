import { useState } from "react";
import { updateSpace } from "@/ApiManager/apiMethods";
import useGetServerById from "@/hooks/server/useGetServerById";

const useUpdateSpace = () => {
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetServerById();

  const handleUpdateSpace = async (spaceId: string, data: any) => {
    setLoading(true);

    try {
      await updateSpace(spaceId, data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleUpdateSpace };
};

export default useUpdateSpace;
