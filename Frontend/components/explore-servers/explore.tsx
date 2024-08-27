"use client";

import Search from "@/components/explore-servers/search";
import Tags from "@/components/explore-servers/tags";
import Servers from "@/components/explore-servers/servers";
import useGetServers from "@/hooks/useGetServers";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Explore() {
  const searchParams = useSearchParams();

  const searchParam = {
    type: "all",
    search: searchParams.get("search") || "",
    tags: searchParams.get("tags") || "",
    limit: 10,
  };

  const { data, mutate, isLoading } = useGetServers(searchParam);

  useEffect(() => {
    mutate();
  }, [searchParams, mutate]);

  return (
    <div className="h-dvh overflow-auto">
      <Search />
      <Tags />
      <Servers isLoading={isLoading} servers={data} />
    </div>
  );
}
