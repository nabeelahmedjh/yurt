"use client";

import useGetTags from "@/hooks/useGetTags";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Tags() {
  const { data } = useGetTags();

  return (
    <div className="mx-12 my-8 border pt-4 pb-1 px-4 rounded-2xl flex">
      <div className="flex items-center gap-2 mr-4 pb-3">
        <p className="font-medium">Tags</p>
        <div className="w-[2px] h-[80%] rounded-full bg-black"></div>
      </div>
      <ScrollArea>
        <div className="flex gap-4 overflow-x-hidden mb-4">
          {data?.map((tag: any) => (
            <Tag key={tag._id} tag={tag} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function Tag({ tag }: { tag: any }) {
  const isTagSelected = false;

  return (
    <>
      <div
        className={`px-8 py-1 rounded-full border-2 border-primary flex items-center ${
          isTagSelected ? "bg-primary" : ""
        }`}
      >
        <p className="text-nowrap">{tag.name}</p>
      </div>
    </>
  );
}
