"use client";

import { Button } from "@/components/ui/button";
import { BotMessageSquareIcon, BrushIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatRightbar() {
  const router = useRouter();

  return (
    <div className="bg-white h-dvh p-1">
      <div className="h-full flex flex-col items-center mx-4 gap-4 mt-4">
        <h1 className="font-bold text-xl w-full">Study Tools</h1>
        <div className="w-full space-y-4">
          <Button
            variant="tool"
            className="w-full"
            onClick={() => router.push("/whiteboard")}
          >
            <p className="font-bold max-lg:text-xs">Let&apos;s collaborate</p>
            <BrushIcon className="ml-1 xl:ml-4" />
          </Button>
          <Button
            variant="tool"
            className="w-full"
            onClick={() => alert("Feature in progress")}
          >
            <p className="font-bold">Ask questions</p>
            <BotMessageSquareIcon className="ml-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
