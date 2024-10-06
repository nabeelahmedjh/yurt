import { joinVoiceSpace } from "@/ApiManager/apiMethods";
import VideoConference from "./video-conference";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VideoConferenceContainer() {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { spaceID } = useParams();

  useEffect(() => {
    async function join() {
      try {
        const response: any = await joinVoiceSpace(spaceID as string);
        // console.log(response.data.token);
        setToken(response.data.token);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    spaceID && join();
  }, [spaceID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <VideoConference token={token} />;
}
