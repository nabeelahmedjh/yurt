/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL, PROXY_API_URL } from "@/constants";
import { File, FileDownIcon, User } from "lucide-react";
import { PhotoView } from "react-photo-view";
import { format } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import ProfileModal from "@/components/modals/profile/profile-modal";

export default function MessageItem({
  img,
  name,
  content,
  currentDate,
  attachment,
  sentBy,
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
  sentBy: any;
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <ProfileModal profileData={sentBy}>
            <div className="cursor-pointer">
              <Avatar data-src={API_URL + "/" + img} className="size-10 -mb-6">
                <AvatarImage src={API_URL + "/" + img} />
                <AvatarFallback className="bg-white border">
                  <User className="size-8" />
                </AvatarFallback>
              </Avatar>
            </div>
          </ProfileModal>

          <div className="flex gap-4">
            <p className="text-[1rem] self-center font-medium">{name}</p>
            <p className="text-sm self-center text-gray-600">
              {format(currentDate, "p")}
            </p>
          </div>
        </div>
        <div className="ml-14 bg-[#B9FA77] min-w-16 max-w-max p-3 shadow-sm rounded-md rounded-tl-none">
          <p className="text-lg whitespace-pre-wrap inline-block px-2 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>

          <div
            className={` mt-2  lg:grid gap-2 lg:grid-cols-3 ${
              attachment?.length === 1 ? "lg:grid-cols-1" : ""
            } ${attachment?.length === 2 ? "lg:grid-cols-2" : ""}`}
          >
            {attachment
              ?.filter((file) => file?.type.includes("image"))
              .map((file, index) => (
                <div key={index} className="max-w-fit">
                  <PhotoView src={API_URL + "/" + file.source}>
                    <img
                      alt=""
                      src={API_URL + "/" + file.source}
                      className="max-w-44 h-full aspect-[9/10] object-cover rounded-sm"
                    />
                  </PhotoView>
                </div>
              ))}

            {attachment
              ?.filter((file) => !file?.type.includes("image"))
              .map((file, index) => (
                <div key={index} className="max-w-fit max-h-fit">
                  <a
                    download={file.name}
                    href={PROXY_API_URL + "/" + file.source}
                    target="_blank"
                    className="text-center block bg-neutral-100 rounded-sm  aspect-[9/10]"
                  >
                    <div className="flex flex-col justify-center items-center h-full">
                      <FileDownIcon className="mx-2 mt-4 size-28" />
                      <div className="flex flex-col justify-center items-center text-center">
                        <p className="text-sm">{formatFileSize(file.size)}</p>
                        <p
                          title={file.name}
                          className="max-w-36 overflow-hidden whitespace-nowrap text-ellipsis mx-4"
                        >
                          {file.name}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
