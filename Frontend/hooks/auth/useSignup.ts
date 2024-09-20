import { useState } from "react";
import { signup, getProfile } from "@/ApiManager/apiMethods";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { TOKEN, USER_ID } from "@/constants";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (data: any) => {
    setLoading(true);

    try {
      const response: any = await signup(data);

      if (response) {
        if (response.token) {
          setCookie(TOKEN, response.token);

          const data: any = await getProfile();
          const userId = data.data._id;
          setCookie(USER_ID, userId);

          router.refresh();

          /* Below solution does not work for some reason.
           current workaround is to have the route push in layout
           and then refresh the page in here */

          // router.push("/servers");
        }

        toast.success("Registered Successfully");
      }

      return null;
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err.response.data.error.message);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading: loading, handleSignup };
};

export default useSignup;
