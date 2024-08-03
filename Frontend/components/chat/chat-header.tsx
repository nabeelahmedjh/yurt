"use client";

import { Tent } from "lucide-react";
import { useParams } from "next/navigation";
import useGetServers from "@/hooks/useGetServers";

export default function ChatHeader() {
  const params = useParams<{ serverID: string; spaceID: string }>();

  const { data, isLoading } = useGetServers();

  if (isLoading) return;

  return (
    <div>
      <div className="bg-white h-[72px] flex flex-col items-start justify-center pl-4 gap-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
        {params.serverID && params.spaceID && (
          <div className="flex gap-4">
            <span className="self-center">
              <Tent className="size-10" />
            </span>
            <div className="flex flex-col">
              <p className="font-medium">
                {
                  data
                    ?.filter(
                      (server: any) => server._id === params.serverID
                    )?.[0]
                    ?.spaces?.filter(
                      (space: any) => space._id === params.spaceID
                    )?.[0]?.name
                }
              </p>
              <p className="text-gray-600 font-light">
                {
                  data
                    ?.filter(
                      (server: any) => server._id === params.serverID
                    )?.[0]
                    ?.spaces?.filter(
                      (space: any) => space._id === params.spaceID
                    )?.[0]?.description
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
