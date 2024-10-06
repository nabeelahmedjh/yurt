import { SwiperSlide } from "swiper/react";
import SwiperContainer from "@/components/swiper/swiper-container";

import { useParams, usePathname } from "next/navigation";

import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatCenterbar from "@/components/chat/chat-centerbar";
import ChatRightbar from "@/components/chat/chat-rightbar";

import WhiteboardLayout from "@/components/whiteboard/whiteboard-layout";
import FileManagerContainer from "@/components/filemanager/file-manager-container";
import Explore from "@/components/explore-servers/explore";
import ServerGreeting from "@/components/server-greeting";

export default function ChatMobileLayout() {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const pathname = usePathname();

  const isGreetingOpen =
    pathname === "/servers" || pathname === `/servers/${params.serverID}`;
  const isExploreOpen = pathname === "/explore";
  const isWhiteboardOpen = pathname === "/whiteboard";
  const isFileManagerOpen = pathname.endsWith("/filemanager");

  return (
    <div className="h-dvh">
      <SwiperContainer>
        <SwiperSlide>
          <ChatSidebar />
        </SwiperSlide>
        <SwiperSlide>
          {isWhiteboardOpen && <WhiteboardLayout />}
          {params?.spaceID && <ChatCenterbar />}
          {isGreetingOpen && <ServerGreeting />}
          {isExploreOpen && <Explore />}
          {isFileManagerOpen && <FileManagerContainer />}
        </SwiperSlide>
        <SwiperSlide>
          <ChatRightbar />
        </SwiperSlide>
        {/* <div slot="container-start">TOP NAVBAR</div> */}
        {/* <div slot="container-end">BOTTOM NAVBAR</div> */}
      </SwiperContainer>
    </div>
  );
}
