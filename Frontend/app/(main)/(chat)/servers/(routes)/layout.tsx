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
                    `/servers/${server._id}/${server.spaces[0]._id}`
                  )
                }
                key={server._id}
                className={params.serverID === server._id ? "bg-cyan-600" : ""}
              >
                {server.name}
              </div>
            ))}
          </div>
        )}
        {params.serverID && params.spaceID && (
          <div className="space-y-4">
            {data
              ?.filter((server: any) => server._id === params.serverID)
              .map((server: any) => (
                <div key={server._id}>
                  {server.spaces.map((space: any) => (
                    <div
                      onClick={() =>
                        router.replace(
                          `/servers/${params.serverID}/${space._id}`
                        )
                      }
                      key={space._id}
                      className={
                        params.spaceID === space._id ? "bg-purple-600" : ""
                      }
                    >
                      {space.name}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
        {params.serverID && params.spaceID && (
          <div className="space-y-4">
            {data && <Messages params={params} />}
          </div>
        )}
      </div>
      {children}
    </>
  );
}
