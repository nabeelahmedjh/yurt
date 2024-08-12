import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { TOKEN, API_URL, USER_ID } from "@/constants";
import { getProfile } from "@/ApiManager/apiMethods";

export default function useGoogleOAuth() {
  const router = useRouter();

  const handleGoogleOAuth = async () => {
    const width = 500;
    const height = 550;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const options = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`;

    const authWindow = window.open(`${API_URL}/auth/google`, "_blank", options);

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== API_URL) {
        return;
      }
      const { data } = event;
      setCookie(TOKEN, data.token);

      try {
        const profileData: any = await getProfile();
        const userId = profileData.data.user._id;
        setCookie(USER_ID, userId);

        router.refresh();
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        window.removeEventListener("message", handleMessage);
        authWindow?.close();
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return handleGoogleOAuth;
}
