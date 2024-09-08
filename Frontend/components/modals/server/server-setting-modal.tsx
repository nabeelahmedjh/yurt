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
import { Trash2Icon } from "lucide-react";

import UploadAvatar from "@/components/image-uploader/upload-avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import useGetServerById from "@/hooks/server/useGetServerById";
import useUpdateServer from "@/hooks/server/useUpdateServer";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function ServerSettingModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: serverData } = useGetServerById();
  const { handleUpdateServer, loading } = useUpdateServer();
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

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        OverlayclassName="place-items-start"
        className="min-w-[50vw] px-20"
      >
        <DialogHeader>
          <div>
            <DialogTitle className="bg-lime-100 w-fit px-2 py-1 rounded-[8px] font-medium text-2xl">
              Server Overview
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            View & Edit Server Settings
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="serverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Server Image</FormLabel>
                    <FormControl>
                      <div className="w-20">
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
        <div className="flex flex-col">
          <p className="font-semibold text-lg"> {serverData?.[0].name} </p>
        </div>
        <div className="mt-8">
          <div className="min-h-44 mb-8 w-full">
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
                  <div className="flex gap-40 mt-4">
                    <p className="text-red-500 text-balance">
                      If you delete your account you will no longer be able to
                      access any of your joined server or messages in Yurt
                      platform.
                    </p>
                    <div>
                      <Button
                        variant="unstyled"
                        size="unsized"
                        className="bg-secondary rounded-[4px] py-1 px-2 h-8 space-x-2 hover:underline"
                      >
                        <Trash2Icon />
                        <p>Delete Account</p>
                      </Button>
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
