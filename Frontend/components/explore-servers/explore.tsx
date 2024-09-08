"use client";

import Search from "@/components/explore-servers/search";
import Tags from "@/components/explore-servers/tags";
import Servers from "@/components/explore-servers/servers";
import useGetServers from "@/hooks/server/useGetServers";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Explore() {
  const searchParams = useSearchParams();

  const searchParam = {
    type: "all",
    search: searchParams.get("search") || "",
    tags: searchParams.get("tags") || "",
    limit: 10,
  };

  const { data, mutate, isLoading, size, setSize, isReachingEnd, noMorePages } =
    useGetServers(searchParam, true);

  useEffect(() => {
    mutate();
  }, [searchParams, mutate]);

  return (
    <div className="h-dvh overflow-y-scroll">
      <Search />
      <Tags />
      <Servers isLoading={isLoading} servers={data} />
      {!isLoading && (
        <div className="w-full flex justify-center mb-8">
          {noMorePages ? (
            <div>
              {data.length > 0 ? (
                <>
                  <p className="text-center">Wow, You sure have come far</p>
                  <p className="text-center">choose from above servers</p>
                </>
              ) : (
                <>
                  <p className="text-center">Your search is too specific</p>
                  <p className="text-center">
                    We do not have any servers with that term
                  </p>
                </>
              )}
            </div>
          ) : (
            <Button
              onClick={() => {
                if (size && setSize) {
                  setSize(size + 1);
                }
              }}
            >
              <p className="mr-2">Load more</p>
              <ArrowDown className="size-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
