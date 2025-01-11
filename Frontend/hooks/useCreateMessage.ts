import { useState } from "react";
import { createMessage } from "@/ApiManager/apiMethods";

const useCreateMessage = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateMessage = async (spaceId: string, data: any) => {
    setLoading(true);

    try {
      const response = await createMessage(spaceId, data);
      return { result: response };
    } catch (err) {
      return { error: (err as Error).message || "An error occurred" };
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreateMessage };
};

export default useCreateMessage;
