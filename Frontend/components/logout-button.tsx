"use client";
import { LogOut } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TOKEN, USER_ID } from "@/constants";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={() => {
              deleteCookie(TOKEN);
              deleteCookie(USER_ID);
              router.refresh();
            }}
            className="hover:bg-neutral-200 p-2 rounded-[8px]"
          >
            <LogOut strokeWidth={1} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>Logout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
