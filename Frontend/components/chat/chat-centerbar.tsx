import ChatContent from "@/components/chat/chat-content";
import VideoConferenceContainer from "@/components/video-conferencing/video-conference-container";
import useGetServerById from "@/hooks/server/useGetServerById";
import { useParams } from "next/navigation";

export default function ChatCenterbar() {
  const { spaceID } = useParams();

  const { data, isLoading } = useGetServerById();

  const spaceType = data?.[0]?.spaces.find(
    (space: any) => space._id === spaceID
  ).type;

  if (isLoading && !data) {
    return <div>Loading...</div>;
  }

  if (spaceType) {
    if (spaceType === "CHAT") {
      return <ChatContent />;
    }

    if (spaceType === "VOICE") {
      return <VideoConferenceContainer />;
    }
  }
}
