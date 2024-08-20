"use client";

import Search from "@/components/explore-servers/search";
import Tags from "@/components/explore-servers/tags";
import Servers from "@/components/explore-servers/servers";

export default function Explore() {
  return (
    <div className="h-dvh overflow-auto">
      <Search />
      <Tags />
      <Servers />
    </div>
  );
}
