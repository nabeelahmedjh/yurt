import { useState } from "react";
import { deleteProfile } from "@/ApiManager/apiMethods";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { TOKEN, USER_ID } from "@/constants";

////////////////////////////////////////////////////////////////////////////

const useDeleteProfile = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDeleteProfile = async () => {
    setLoading(true);

    try {
      await deleteProfile();
      deleteCookie(TOKEN);
      deleteCookie(USER_ID);
      router.push(`/`);
      return null;
    } catch (err) {
      toast.error("Something went wrong while deleting the account");
      return (err as Error).message || "An error occurred";
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDeleteProfile };
};

export default useDeleteProfile;
