import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { TOKEN, API_URL } from "@/constants";

export default function useGoogleOAuth() {
  const router = useRouter();

  const handleGoogleOAuth = () => {
    const width = 500;
    const height = 550;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const options = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`;
    window.open(`${API_URL}/auth/google`, "_blank", options);

    window.addEventListener("message", (event) => {
      if (event.origin !== API_URL) {
        return;
      }
      const { data } = event;
  
      setCookie(TOKEN, data.token);
  
      router.refresh();
    });
  };



  return handleGoogleOAuth;
}