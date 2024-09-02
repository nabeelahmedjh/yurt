import { useState } from "react";
import { updateProfile } from "@/ApiManager/apiMethods";
import useGetProfile from "@/hooks/useGetProfile";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const { mutate } = useGetProfile();

  const handleUpdateProfile = async (data: any) => {
    setLoading(true);

    try {
      await updateProfile(data);
      mutate();
      return null;
    } catch (err) {
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleUpdateProfile };
};

export default useUpdateProfile;
