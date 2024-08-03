import { useState } from 'react';
import { signup } from '@/ApiManager/apiMethods';
import { toast } from "sonner";


const useSignup = () => {
  const [loading, setLoading] = useState(false);


  const handleSignup = async (data: any) => {
    setLoading(true);

    try {
      const response:any = await signup(data);

      if(response) {
        toast.success("Registered Successfully");
      }
      
      return null;

    } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong, try again.");

    } finally {
      setLoading(false);
    }
  };

  return { isLoading:loading, handleSignup };
};

export default useSignup;
