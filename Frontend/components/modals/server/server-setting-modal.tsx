/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { toast } from "sonner";
import {
  ImageUpIcon,
  Loader,
  Pencil,
  PencilIcon,
  Trash,
  Trash2Icon,
  UserRoundPlusIcon,
} from "lucide-react";

import UploadAvatar from "@/components/image-uploader/upload-avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ConfirmAlert from "@/components/confirm-alert";
import { ScrollArea } from "@/components/ui/scroll-area";

import { API_URL } from "@/constants";

import UpdateSpaceModal from "@/components/modals/space/update-space-modal";
import ServerUpdateModal from "@/components/modals/server/server-update-modal";

import useGetServerById from "@/hooks/server/useGetServerById";
import useUpdateServer from "@/hooks/server/useUpdateServer";
import useDeleteSpace from "@/hooks/space/useDeleteSpace";
import useDeleteServer from "@/hooks/server/useDeleteServer";
import CreateInviteModal from "./create-invite-modal";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function ServerSettingModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BannerInputRef = useRef<HTMLInputElement>(null);
  const { data: serverData } = useGetServerById();
  const { handleUpdateServer, loading } = useUpdateServer();
  const { handleDeleteSpace, loading: deleteSpaceLoading } = useDeleteSpace();
  const { handleDeleteServer } = useDeleteServer();

  const MAX_FILE_SIZE_MB = 1;

  const formSchema = z.object({
    serverImage: z
      .union([z.instanceof(File), z.undefined()])
      .refine((file) => file !== undefined, "Server Image is required.")
      .refine(
        (file) =>
          file === undefined || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        {
          message: `File size must be less than ${MAX_FILE_SIZE_MB}MB.`,
        }
      )
      .refine((file) => file === undefined || file.type.startsWith("image/"), {
        message: "Only Image is allowed.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverImage: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.serverImage) return;

    const formData = new FormData();
    formData.append("serverImage", values.serverImage);

    const error = await handleUpdateServer(formData);

    if (!error) {
      toast.success("Server Image Updated Successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      form.reset();
    } else {
      toast.error("Something went wrong");
    }
  }

  async function submitBanner(banner: File) {
    if (!banner) return;

    if (banner.size > 1024 * 1024 * 1) {
      toast.error("File size must be less than 1MB.");
      if (BannerInputRef.current) {
        BannerInputRef.current.value = "";
      }
      return;
    }

    const formData = new FormData();
    formData.append("banner", banner);

    const error = await handleUpdateServer(formData);

    if (!error) {
      toast.success("Server Banner Updated Successfully");

      if (BannerInputRef.current) {
        BannerInputRef.current.value = "";
      }
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        OverlayclassName="place-items-start"
        className="min-w-[50vw] px-0"
      >
        <DialogHeader className="px-10">
          <div>
            <DialogTitle className="w-fit px-2 py-1 rounded-[8px] font-medium text-gray-700 text-xl">
              Server Overview
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            View & Edit Server Settings
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary rounded-t-[40px] relative">
          <form>
            <input
              className="hidden"
              type="file"
              name="banner"
              ref={BannerInputRef}
              onChange={(e) =>
                e.target.files && submitBanner(e.target.files[0])
              }
            />
          </form>

          <button
            autoFocus={false}
            onClick={() => BannerInputRef.current?.click()}
            type="button"
            className="absolute right-2 bottom-2 bg-white/95 hover:scale-105 transition rounded-full px-2 py-1 flex gap-1"
          >
            <ImageUpIcon strokeWidth={1.5} className="text-black/70" /> Change
            Banner
          </button>

          <img
            className="border rounded-t-[40px] h-[120px] w-full object-cover object-bottom"
            src={
              serverData?.[0].banner
                ? API_URL + "/" + serverData?.[0].banner.source
                : "/server_banner_placeholder.png"
            }
            alt="Server Banner"
          />
        </div>
        <div className="px-10 -mt-24">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="serverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Server Image</FormLabel>
                    <FormControl>
                      <div className="w-24">
                        <UploadAvatar
                          className="h-auto w-auto rounded-full border-b-4"
                          defaultAvatar={serverData?.[0].serverImage?.source}
                          fileRef={fileInputRef}
                          maxFileSize={MAX_FILE_SIZE_MB}
                          field={field}
                          formSubmitter={form.handleSubmit(onSubmit)}
                          loading={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-center hidden" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="w-full justify-between items-center flex px-10">
          <div className="flex gap-2 ml-2">
            <p className="font-semibold text-lg"> {serverData?.[0].name} </p>
            <CreateInviteModal inviteCodes={serverData?.[0].inviteCodes}>
              <button className="bg-neutral-100 hover:bg-neutral-200 p-1 rounded-full">
                <UserRoundPlusIcon />
              </button>
            </CreateInviteModal>
          </div>
          <ServerUpdateModal>
            <button className="rounded-full bg-neutral-100 p-2 hover:bg-neutral-200">
              <PencilIcon />
            </button>
          </ServerUpdateModal>
        </div>
        <div className="px-10 w-full overflow-hidden">
          <div className="min-h-28 mb-1 w-full bg-neutral-100 px-2 py-6 rounded-sm">
            <p className="break-words">{serverData?.[0].description}</p>
          </div>
          <div className="mb-8">
            <div className="py-2 mb-2 flex flex-wrap gap-2">
              {serverData?.[0].tags.map((tag: any) => (
                <span
                  key={tag._id}
                  className=" border-gray-400 border-2 text-gray-500 rounded-full px-6 py-1"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-neutral-100 rounded-sm pl-4 py-2">
            <h3 className="font-medium rounded-[8px] px-2 mb-2 bg-lime-200 w-fit">
              Spaces
            </h3>
            <ScrollArea>
              <ul className="py-2 mr-4 mb-2 flex flex-wrap gap-2 max-h-56">
                {serverData?.[0].spaces.map((space: any) => (
                  <li
                    key={space._id}
                    className="w-full rounded-sm border bg-white flex px-4 py-1 justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={
                          space.spaceImage
                            ? API_URL + "/" + space.spaceImage.source
                            : "/space.png"
                        }
                        alt={space.name}
                        className="h-8 rounded-full"
                      />
                      <p
                        title={space.name}
                        className="font-medium text-ellipsis overflow-hidden mr-4"
                      >
                        {space.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <UpdateSpaceModal spaceData={space}>
                        <button className="rounded-full p-2 bg-neutral-100 hover:bg-neutral-200">
                          <Pencil />
                        </button>
                      </UpdateSpaceModal>
                      <ConfirmAlert
                        title="Delete Space"
                        descripton="Are you sure you want to delete this space?"
                        action={async () => {
                          await handleDeleteSpace(space._id);
                        }}
                        actionLabel="Delete"
                        actionClassName="bg-red-500 hover:bg-red-500 hover:text-white border-0"
                      >
                        <button
                          disabled={deleteSpaceLoading}
                          className="rounded-full p-2 bg-neutral-100 hover:bg-neutral-200"
                        >
                          {deleteSpaceLoading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <Trash className="text-red-500" />
                          )}
                        </button>
                      </ConfirmAlert>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div className="mt-16">
            <Accordion type="single" collapsible>
              <AccordionItem className="border-b-0" value="item-1">
                <AccordionTrigger className="w-full flex underline hover:no-underline">
                  <p className="bg-lime-200 px-1 rounded-[4px] text-nowrap mb-4">
                    Advanced Settings
                  </p>
                  <div className="w-full">
                    <Separator className="bg-gray-300" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-20 mt-4">
                    <p className="text-red-500 text-balance">
                      If you delete this server, you will no longer be able to
                      access the server.
                    </p>
                    <div>
                      <ConfirmAlert
                        title="Delete Server"
                        descripton="Are you sure you want to delete this server?"
                        action={async () => {
                          await handleDeleteServer();
                        }}
                        actionLabel="Delete"
                        actionClassName="bg-red-500 hover:bg-red-500 hover:text-white border-0"
                      >
                        <Button
                          variant="unstyled"
                          size="unsized"
                          className="bg-secondary rounded-[4px] py-1 px-2 h-8 space-x-2 hover:underline"
                        >
                          <Trash2Icon />
                          <p>Delete Server</p>
                        </Button>
                      </ConfirmAlert>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
