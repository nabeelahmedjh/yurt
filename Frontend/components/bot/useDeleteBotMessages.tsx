import { useState } from "react";
import { deleteBotMessages } from "@/ApiManager/apiMethods";
import useGetBotMessages from "./useGetBotMessages";
import { getProfile } from "@/ApiManager/apiMethods";
import { toast } from "sonner";

////////////////////////////////////////////////////////////////////////////

const useDeleteBotSpace = () => {
  const [loading, setLoading] = useState(false);

  const { mutate: mutateBotMessages } = useGetBotMessages();

  const handleDeleteBotMessages = async () => {
    setLoading(true);

    try {
      const profile: any = await getProfile();

      await deleteBotMessages(profile.data.botSpace);

      mutateBotMessages((data) => data && data.map(() => []), {
        revalidate: true,
      });

      toast.success("Conversation Deleted successfully");
      return null;
    } catch (err) {
      toast.error("Something went wrong while deleting the conversation");
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDeleteBotMessages };
};

export default useDeleteBotSpace;
