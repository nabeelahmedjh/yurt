/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Separator } from "@/components/ui/separator";

import { CompassIcon, Plus, User2 } from "lucide-react";

import useSWR, { useSWRConfig } from "swr";

import { useParams, useRouter } from "next/navigation";

import { getData } from "@/lib/get-data";

import CreateServerModal from "@/components/modals/create-server-modal";
import LogoutButton from "@/components/logout-button";
import { Button } from "../ui/button";

import { socket } from "@/app/socket-client";

export default function ChatServers() {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR("/servers", getData);

  const { data: profileData } = useSWR("/auth/profile", getData);

  const profile = {
    name: profileData?.user?.email ?? "Unknown",
    img: "",
  };

  useEffect(() => {
    socket.emit("identity", profileData?.user?._id);
    console.log("profileData", profileData?.user?._id);
  }, []);

  // useEffect(() => {
  //   console.log("profile", profileData);
  //   console.log("data", data);
  // }, [profileData, data]);

  useEffect(() => {
    mutate("/servers");
  }, [params]);

  return (
    <div className="bg-secondary border-r-2 h-dvh p-2 flex flex-col items-center">
      <div className="p-2">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src={profile.img ?? ""} />
                <AvatarFallback className="bg-green-200 text-green-950 font-medium capitalize">
                  {profile.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word: any) => word.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              className=" bg-green-950 text-green-200 rounded-[24px]"
              side="right"
              sideOffset={10}
            >
              <span className="flex items-center">
                <User2 className="size-6" />{" "}
                <p className="self-end ms-1">{profile.name}</p>
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator className="w-[70%] my-2 bg-gray-300" />
      <div>
        {data?.length > 0 &&
          data?.map((server: any) => (
            <div className="p-2" key={server._id}>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => router.push(`/servers/${server._id}`)}
                  >
                    <Avatar
                      className={`rounded-[8px] ring-slate-900 ${
                        params.serverID === server._id && "ring-[3px]"
                      }`}
                    >
                      <AvatarImage src={server.img ?? ""} />
                      <AvatarFallback className="rounded-[8px] bg-white font-medium">
                        {server.name
                          .split(" ")
                          .slice(0, 2)
                          .map((word: any) => word.charAt(0))
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>{server.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
      </div>
      <CreateServerModal>
        <div className="flex justify-center mt-2">
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger>
                <div className="hover:bg-gray-300 p-2 rounded-[8px]">
                  <Plus />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p>Create Server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CreateServerModal>

      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger onClick={() => router.push("/explore-servers")}>
            <div className="hover:bg-gray-300 p-2 rounded-[8px]">
              <CompassIcon className="size-6" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>Explore Servers</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {!isLoading && (
        <div className="absolute bottom-8">
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
