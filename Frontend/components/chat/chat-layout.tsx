"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { ImperativePanelHandle } from "react-resizable-panels";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatContent from "@/components/chat/chat-content";
import ChatRightbar from "@/components/chat/chat-rightbar";
import Whiteboard from "@/components/whiteboard";
import ServerGreeting from "@/components/server-greeting";
import { useViewportWidth } from "@/lib/viewport-width";
import { useParams } from "next/navigation";
import SplashScreen from "@/components/splash-screen";

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export default function ChatLayout() {
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const params = useParams<{ serverID: string; spaceID: string }>();

  const viewportWidth = useViewportWidth();

  // if viewport width > 400 px, how much in percent is 340px of viewport width
  const newSize =
    viewportWidth > 400
      ? ((isWhiteboardOpen || !params?.serverID ? 75 : 340) / viewportWidth) *
        100
      : 60;

  const ref = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const panel = ref.current;

    if (panel) {
      panel.resize(newSize);
    }
  }, [newSize]);

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
        <ResizablePanel ref={ref} maxSize={newSize} minSize={1}>
          <ChatSidebar isWhiteboardOpen={isWhiteboardOpen} />
        </ResizablePanel>
        {!isWhiteboardOpen && params?.serverID && (
          <ResizableHandle className="bg-black hover:bg-gray-400 w-[2px]" />
        )}
        <ResizablePanel defaultSize={65}>
          {isWhiteboardOpen && <Whiteboard />}
          {!isWhiteboardOpen && params?.spaceID && <ChatContent />}
          {!isWhiteboardOpen && !params?.spaceID && !params.serverID && (
            <ServerGreeting />
          )}
        </ResizablePanel>
        <ResizableHandle className="bg-black hover:bg-gray-400 w-[2px]" />
        <ResizablePanel maxSize={20} minSize={1} defaultSize={20}>
          <ChatRightbar setIsWhiteboardOpen={setIsWhiteboardOpen} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
