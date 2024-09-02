/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL, PROXY_API_URL } from "@/constants";
import { File, User } from "lucide-react";
import { PhotoView } from "react-photo-view";
import { format } from "date-fns";
import { formatFileSize } from "@/lib/utils";

export default function MessageItem({
  img,
  name,
  content,
  currentDate,
  attachment,
}: {
  img?: string;
  name: string;
  content: string;
  currentDate: Date;
  attachment?: {
    name: string;
    size: number;
    source: string;
    type: string;
  }[];
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <div onClick={() => alert("User Profile")} className="cursor-pointer">
            <Avatar data-src={img} className="size-10 -mb-6">
              <AvatarImage src={img} />
              <AvatarFallback className="bg-white border">
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex gap-4">
            <p className="text-[1rem] self-center font-medium">{name}</p>
            <p className="text-sm self-center text-gray-600">
              {format(currentDate, "p")}
            </p>
          </div>
        </div>
        <div className="ml-14 bg-[#B9FA77] min-w-16 max-w-max p-1 shadow-md rounded-md rounded-tl-none">
          <p className=" whitespace-pre-wrap inline-block px-2 py-1 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>

          {attachment?.map((file, index) => (
            <div key={index} className="p-2">
              {file?.type.includes("image") ? (
                <PhotoView src={API_URL + "/" + file.source}>
                  <img
                    alt=""
                    src={API_URL + "/" + file.source}
                    className="h-20 max-w-64 object-cover rounded-[4px]"
                  />
                </PhotoView>
              ) : (
                <div className="flex flex-col">
                  <File className="mx-2 size-20 text-lime-50" />
                  <div className="flex flex-col my-1">
                    {" "}
                    <p className="text-center">{file.name}</p>
                    <p className="text-sm text-center text-lime-700">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <a
                    // href={API_URL + "/" + file.source}
                    // download requires same origin so need to use proxy api

                    download={file.name}
                    href={PROXY_API_URL + "/" + file.source}
                    target="_blank"
                    className="mt-2 bg-lime-50 hover:underline-offset-2 hover:underline p-[.5px] text-center rounded-[4px]"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
