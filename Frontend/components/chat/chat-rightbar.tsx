"use client";

import { Button } from "@/components/ui/button";
import { BrushIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import BotChatContent from "@/components/bot/bot-content";
import { useSwiper } from "swiper/react";

export default function ChatRightbar() {
  const swiper = useSwiper();

  const router = useRouter();
  const pathname = usePathname();
  const isWhiteboardOpen = pathname === "/whiteboard";

  return (
    <div className="h-dvh bg-white pt-1 flex flex-col justify-between">
      <div className="flex flex-col items-center mx-4 gap-4 mt-4">
        <h1 className="font-bold text-xl w-full">Study Tools</h1>
        <div className="w-full space-y-4">
          <Button
            variant="tool"
            className="w-full"
            onClick={() => {
              isWhiteboardOpen ? router.back() : router.push("/whiteboard");
              swiper && swiper.slidePrev();
            }}
          >
            <p className="font-bold max-lg:text-xs">Let&apos;s collaborate</p>
            <BrushIcon className="ml-1 xl:ml-4" />
          </Button>
        </div>
      </div>
      <div>
        <BotChatContent />
      </div>
    </div>
  );
}
