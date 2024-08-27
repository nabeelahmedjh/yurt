"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import searchIllustration from "@/public/search-illustration.svg";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const debouncedSearch = useDebouncedCallback((e) => {
    handleSearch(e);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-secondary border-2 mx-12 mt-12 pt-8 flex flex-col gap-4 items-center">
      <h1 className="font-semibold text-2xl">Find community to study</h1>
      <h3 className=" text-black/50 font-medium text-xl">
        A community that is focused on learning{" "}
      </h3>
      <div className="w-[50%] flex justify-center">
        <Input
          defaultValue={searchParams.get("search")?.toString()}
          onChange={debouncedSearch}
          className="rounded-[8px] focus-visible:ring-0 border-2 h-10 bg-white pr-3"
          type="text"
          placeholder="Search Servers.."
          rightIcon={<SearchIcon className="text-lime-600" />}
          rightIconClassName="top-[2%] right-[1%]"
        />
      </div>
      <div>
        <Image alt="" src={searchIllustration} />
      </div>
    </div>
  );
}
