"use client";

import useGetTags from "@/hooks/useGetTags";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

export default function Tags() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { data, isLoading } = useGetTags();

  if (isLoading) return "Loading...";

  return (
    <div className="mx-12 my-8 border pt-4 pb-1 px-4 rounded-2xl flex max-lg:flex-col">
      <div className="flex items-center gap-2 mr-4 pb-3">
        <p className="font-medium">Tags</p>
        <div className="w-[2px] h-[80%] rounded-full bg-black"></div>
      </div>
      <ScrollArea>
        <div className="flex max-lg:flex-col gap-4 lg:overflow-x-hidden mb-4 max-lg:max-h-[100px]">
          {data?.map((tag: any) => (
            <Tag key={tag._id} tag={tag} />
          ))}
        </div>
        <ScrollBar orientation={desktop ? "horizontal" : "vertical"} />
      </ScrollArea>
    </div>
  );
}

function Tag({ tag }: { tag: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const tags = searchParams.get("tags");
  const tagsArray = tags ? tags.split(",") : [];

  const isTagSelected = tagsArray.includes(tag.name);

  function handleTagClick() {
    const params = new URLSearchParams(searchParams);

    if (isTagSelected) {
      const index = tagsArray.indexOf(tag.name);
      tagsArray.splice(index, 1);
    } else {
      tagsArray.push(tag.name);
    }

    const term = tagsArray.join(",");

    if (term) {
      params.set("tags", term);
    } else {
      params.delete("tags");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div
        onClick={() => handleTagClick()}
        className={`px-8 py-1 rounded-full cursor-pointer border-2 border-primary flex items-center ${
          isTagSelected ? "bg-primary" : ""
        }`}
      >
        <p className="text-nowrap">{tag.name}</p>
      </div>
    </>
  );
}
