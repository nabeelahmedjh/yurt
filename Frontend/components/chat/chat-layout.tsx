"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import type { ImperativePanelHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatRightbar from "@/components/chat/chat-rightbar";
import ServerGreeting from "@/components/server-greeting";
import SplashScreen from "@/components/splash-screen";
import Explore from "@/components/explore-servers/explore";
import { useViewportWidth } from "@/lib/viewport-width";
import WhiteboardLayout from "@/components/whiteboard/whiteboard-layout";
import FileManagerContainer from "@/components/filemanager/file-manager-container";
import ChatCenterbar from "@/components/chat/chat-centerbar";

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export default function ChatLayout() {
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const params = useParams<{ serverID: string; spaceID: string }>();
  const pathname = usePathname();

  const viewportWidth = useViewportWidth();

  const isGreetingOpen = pathname === "/servers";
  const isExploreOpen = pathname === "/explore";
  const isWhiteboardOpen = pathname === "/whiteboard";
  const isFileManagerOpen = pathname.endsWith("/filemanager");

  // console.log("pathname", pathname);
  // console.log("isFileManagerOpen", isFileManagerOpen);

  // if viewport width > 400 px, how much in percent is 340px of viewport width
  const newSize =
    viewportWidth > 400
      ? ((isWhiteboardOpen || !params?.serverID ? 75 : 340) / viewportWidth) *
        100
      : 60;

  useEffect(() => {
    // console.log("resizing panel");

    if (leftPanelRef.current) {
      leftPanelRef.current.resize(newSize);
    }

    if (rightPanelRef.current) {
      let newSize: number;
      isExploreOpen ? (newSize = 0) : (newSize = 20);
      rightPanelRef.current.resize(newSize);
    }
  }, [newSize, isExploreOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      const fadeOutTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(fadeOutTimer);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <SplashScreen isFading={isFading} />}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel ref={leftPanelRef} maxSize={newSize} minSize={0}>
          <ChatSidebar />
        </ResizablePanel>

        <ResizableHandle
          className={`bg-black hover:bg-gray-400 w-[2px] ${
            !params?.serverID && "hidden"
          }`}
        />

        <ResizablePanel defaultSize={55}>
          {isWhiteboardOpen && <WhiteboardLayout />}
          {params?.spaceID && <ChatCenterbar />}
          {isGreetingOpen && <ServerGreeting />}
          {isExploreOpen && <Explore />}
          {isFileManagerOpen && <FileManagerContainer />}
        </ResizablePanel>

        <ResizableHandle
          className={`bg-black hover:bg-gray-400 w-[2px] ${
            isExploreOpen && "hidden"
          }`}
        />

        <ResizablePanel
          ref={rightPanelRef}
          maxSize={40}
          minSize={isExploreOpen ? 0 : 20}
        >
          {!isExploreOpen && <ChatRightbar />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
