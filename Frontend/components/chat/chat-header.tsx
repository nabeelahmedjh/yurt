"use client";

import React from "react";

import useSWR from "swr";

import { useParams } from "next/navigation";

import { getData } from "@/lib/get-data";
import { Tent } from "lucide-react";

export default function ChatHeader() {
  const params = useParams<{ serverID: string; spaceID: string }>();

  const { data, error, isLoading } = useSWR("/servers", getData);

  if (isLoading) return;

  return (
    <div>
      <div className="h-[72px] border-b border-gray-300 flex flex-col items-start justify-center pl-4 gap-2">
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
