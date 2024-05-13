"use client";
import React, { useEffect, useRef } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import type { ImperativePanelHandle } from "react-resizable-panels";

import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatContent from "@/components/chat/chat-content";
import ChatRightbar from "@/components/chat/chat-rightbar";

import { useViewportWidth } from "@/lib/viewport-width";

export default function ChatLayout() {
  const viewportWidth = useViewportWidth();

  // if viewport width > 350px, how much in percent is 300 px of viewport width
  const newSize = viewportWidth > 400 ? (350 / viewportWidth) * 100 : 60;

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
          <ChatSidebar />
        </ResizablePanel>
        <ResizableHandle className="bg-gray-200 hover:bg-gray-400 w-[2px]" />
        <ResizablePanel defaultSize={60}>
          <ChatContent />
        </ResizablePanel>
        <ResizableHandle className="bg-gray-200 hover:bg-gray-400 w-[2px]" />
        <ResizablePanel defaultSize={25}>
          <ChatRightbar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
