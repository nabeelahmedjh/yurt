"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useCreateServer from "@/hooks/useCreateServer";
import UploadAvatar from "@/components/image-uploader/upload-avatar";
import useGetTags from "@/hooks/useGetTags";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function CreateServerModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const MultiSelectConatinerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { handleCreateServer } = useCreateServer();

  const { data: tagsData, isLoading: tagsLoading } = useGetTags();

  const tagsList = tagsData
    ?.sort((a: any, b: any) => b.usageCount - a.usageCount)
    .map((tag: any) => ({
      value: tag._id,
      label: `${tag.name}  (${tag.usageCount})`,
    }));

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
        message: "Only Image files are allowed.",
      }),
    name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
    description: z
      .string()
      .min(2, "Description is too short")
      .max(100, "Description is too long"),
    tags: z
      .string()
      .array()
      .max(5, "Maximum 5 tags allowed.")
      .min(1, "Minimum 1 tag required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverImage: undefined,
      name: "",
      description: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("serverImage", values.serverImage);
    formData.append("name", values.name);
    formData.append("description", values.description);

    formData.append("tags", JSON.stringify(values.tags));

    // formData.append(
    //   "tags",
    //   JSON.stringify(["66c9af0f61a2b783fe23761b", "66c9af0f61a2b783fe23761d"])
    // );

    const error = await handleCreateServer(formData);

    if (!error) {
      // router.push(`/servers/${data?._id}`);

      // router refresh is required so that identity event emits again and the new
      // server is added in to the room

      router.refresh();

      toast.success("Server Created Successfully");
      form.reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  }

  if (tagsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => {
          const popover = document.querySelector<HTMLElement>(
            ".popover-container-multi-select"
          );
          if (popover) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          const popover = document.querySelector<HTMLElement>(
            ".popover-container-multi-select"
          );
          if (popover) {
            e.preventDefault();
          }
        }}
      >
        <ScrollArea className="max-h-[90dvh] px-4">
          <ScrollBar />
          <DialogHeader>
            <DialogTitle>Create Server</DialogTitle>
            <DialogDescription>
              Enter required details to create a server.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                id="create-server"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 px-1"
              >
                <FormField
                  control={form.control}
                  name="serverImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <div className="mt-4 flex flex-col items-center">
                          <UploadAvatar
                            maxFileSize={MAX_FILE_SIZE_MB}
                            field={field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400"
                          placeholder="Wizards"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A cool place for wizards..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Tags</FormLabel>
                      <FormControl ref={MultiSelectConatinerRef}>
                        <MultiSelect
                          popoverPortalContainerRef={MultiSelectConatinerRef}
                          modalPopover={true}
                          options={tagsList}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select Tags"
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-1"></div>
                <Button type="submit">Create Server</Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
