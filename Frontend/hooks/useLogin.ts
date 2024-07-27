import { useState } from 'react';
import { login } from '@/ApiManager/apiMethods';
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { TOKEN } from '@/constants';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleLogin = async (data: any) => {
    setLoading(true);

    try {
      const response:any = await login(data);
      if (response.token) {
        setCookie(TOKEN, response.token);
        router.refresh();

      /* Below solution does not work for some reason.
         current workaround is to have the route push in layout
         and then refresh the page in here */

      // router.push("/servers");
      }
      
      return null;

    } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong, try again.");

    } finally {
      setLoading(false);
    }
  };

  return { isLoading:loading, handleLogin };
};

export default useLogin;
