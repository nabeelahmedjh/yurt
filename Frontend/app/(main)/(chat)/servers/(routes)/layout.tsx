"use client";
import React from "react";

import { useParams, useRouter } from "next/navigation";

import useSWR from "swr";

import { getData } from "@/lib/get-data";

import { Messages } from "@/components/chat/messages";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/servers", getData);

  return (
    <>
      <h1>Chat Layout</h1>
      <div className="flex gap-8 mb-12 mt-8">
        {params.serverID && params.spaceID && (
          <div className="space-y-4">
            {data?.map((server: any) => (
              <div
                onClick={() =>
                  router.replace(
                    `/servers/${server.serverID}/${server.spaces[0].spaceID}`
                  )
                }
                key={server.serverID}
                className={
                  params.serverID === server.serverID ? "bg-cyan-600" : ""
                }
              >
                {server.serverID}
              </div>
            ))}
          </div>
        )}
        {params.serverID && params.spaceID && (
          <div className="space-y-4">
            {data
              ?.filter((server: any) => server.serverID === params.serverID)
              .map((server: any) => (
                <div key={server.serverID}>
                  {server.spaces.map((space: any) => (
                    <div
                      onClick={() =>
                        router.replace(
                          `/servers/${params.serverID}/${space.spaceID}`
                        )
                      }
                      key={space.spaceID}
                      className={
                        params.spaceID === space.spaceID ? "bg-purple-600" : ""
                      }
                    >
                      {space.spaceID}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
        {params.serverID && params.spaceID && (
          <div className="space-y-4">
            <Messages params={params} />
          </div>
        )}
      </div>
      {children}
    </>
  );
}
