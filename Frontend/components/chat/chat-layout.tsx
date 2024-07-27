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

import Whiteboard from "../whiteboard";

import { useViewportWidth } from "@/lib/viewport-width";

export default function ChatLayout() {
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

  const viewportWidth = useViewportWidth();

  // if viewport width > 400 px, how much in percent is 350 px of viewport width
  const newSize =
    viewportWidth > 400
      ? ((isWhiteboardOpen ? 75 : 350) / viewportWidth) * 100
      : 60;

  const ref = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    const panel = ref.current;

    if (panel) {
      panel.resize(newSize);
    }
  }, [newSize]);

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel ref={ref} maxSize={newSize} minSize={1}>
          <ChatSidebar isWhiteboardOpen={isWhiteboardOpen} />
        </ResizablePanel>
        {!isWhiteboardOpen && (
          <ResizableHandle className="bg-black hover:bg-gray-400 w-[2px]" />
        )}
        <ResizablePanel defaultSize={65}>
          {isWhiteboardOpen ? <Whiteboard /> : <ChatContent />}
        </ResizablePanel>
        <ResizableHandle className="bg-black hover:bg-gray-400 w-[2px]" />
        <ResizablePanel defaultSize={20}>
          <ChatRightbar setIsWhiteboardOpen={setIsWhiteboardOpen} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
