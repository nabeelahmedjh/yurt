import { useState } from "react";
import { updateAvatar } from "@/ApiManager/apiMethods";
import useGetProfile from "@/hooks/user/useGetProfile";

const useUpdateAvatar = () => {
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetProfile();

  const handleUpdateAvatar = async (data: any) => {
    setLoading(true);

    try {
      await updateAvatar(data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleUpdateAvatar };
};

export default useUpdateAvatar;
