/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/constants";
import { File, User } from "lucide-react";
import { PhotoView } from "react-photo-view";

export default function MessageItem({
  img,
  name,
  content,
  attachment,
}: {
  img?: string;
  name: string;
  content: string;
  attachment?: {
    source: string;
    type: string;
  };
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <div>
            <Avatar className="size-10 -mb-6">
              <AvatarImage src={img} />
              <AvatarFallback className="bg-white border">
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-[1rem] self-center font-medium">{name}</p>
        </div>
        <div className="ml-14 bg-[#B9FA77] min-w-16 max-w-max p-1 shadow-md rounded-md rounded-tl-none">
          <p className=" whitespace-pre-wrap inline-block px-2 py-1 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>
          {attachment && (
            <div className="p-2">
              {attachment?.type.includes("image") ? (
                <PhotoView src={API_URL + "/" + attachment.source}>
                  <img
                    alt=""
                    src={API_URL + "/" + attachment.source}
                    className="h-20 max-w-64 object-cover rounded-[4px]"
                  />
                </PhotoView>
              ) : (
                <div className="flex flex-col">
                  <File className="mx-2 size-20 text-lime-50" />
                  <a
                    href={API_URL + "/" + attachment.source}
                    target="_blank"
                    className="mt-2 bg-lime-50 hover:underline-offset-2 hover:underline p-[.5px] text-center rounded-[4px]"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
