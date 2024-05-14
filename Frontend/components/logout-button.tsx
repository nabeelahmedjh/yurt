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

export default function LogoutButton() {
  const router = useRouter();
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={() => {
              deleteCookie("authToken");
              router.refresh();
            }}
            className="hover:bg-gray-300 p-2 rounded-[8px]"
          >
            <LogOut />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>Logout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
