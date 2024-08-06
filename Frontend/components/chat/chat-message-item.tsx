/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/constants";
import { User } from "lucide-react";
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
            <Avatar className="size-8">
              <AvatarImage src={img} />
              <AvatarFallback className="bg-green-200">
                <User className="text-green-700" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-[1rem] self-center font-medium text-green-700">
            {name}
          </p>
        </div>
        <div className="ml-12 bg-[#B9FA77] max-w-max p-4 shadow-md rounded-md rounded-tl-none">
          <p className=" whitespace-pre-wrap inline-block px-2 py-1 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>
          {attachment && (
            <div>
              {attachment?.type.includes("image") ? (
                <PhotoView src={API_URL + "/" + attachment.source}>
                  <img
                    alt=""
                    src={API_URL + "/" + attachment.source}
                    className="h-20 max-w-64 object-cover rounded-lg"
                  />
                </PhotoView>
              ) : (
                <a
                  href={attachment?.source}
                  target="_blank"
                  className="text-blue-500"
                >
                  Download attachment
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
