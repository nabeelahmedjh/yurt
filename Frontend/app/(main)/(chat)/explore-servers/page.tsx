import ChatServers from "@/components/chat/chat-servers";
import Explore from "@/components/explore-servers/explore";

export default function ExploreServers() {
  return (
    <div className="flex">
      <ChatServers />
      <div>
        <Explore />
      </div>
    </div>
  );
}
