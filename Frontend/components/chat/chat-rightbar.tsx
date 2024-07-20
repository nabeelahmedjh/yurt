import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PenIcon } from "lucide-react";

export default function ChatRightbar({
  setIsWhiteboardOpen,
}: {
  setIsWhiteboardOpen?: any;
}) {
  return (
    <div className="h-dvh bg-white">
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger
            onClick={() => setIsWhiteboardOpen((prev: any) => !prev)}
          >
            <div className="hover:bg-gray-300 p-2 rounded-[8px]">
              <PenIcon className="size-6" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>Whiteboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
