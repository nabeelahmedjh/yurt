"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";

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

import useCreateServer from "@/hooks/server/useCreateServer";
import UploadAvatar from "@/components/image-uploader/upload-avatar";
import useGetTags from "@/hooks/useGetTags";
import { Switch } from "@/components/ui/switch";
import { getServers } from "@/ApiManager/apiMethods";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function CreateServerModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const MultiSelectConatinerRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const checkServerUnique = async (name: string) => {
    const data: any = await getServers({
      searchType: "strict",
      search: name,
    });
    if (data.data.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const MAX_FILE_SIZE_MB = 1;
  const formSchema = z.object({
    serverImage: z
      .union([z.instanceof(File), z.undefined()])
      .refine(
        (file) => {
          // console.log("create server file size", file);
          return (
            file === undefined || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
          );
        },
        {
          message: `File size must be less than ${MAX_FILE_SIZE_MB}MB.`,
        }
      )
      .refine((file) => file === undefined || file.type.startsWith("image/"), {
        message: "Only Image files are allowed.",
      }),
    name: z
      .string()
      .min(2, "Name is too short")
      .max(50, "Name is too long")
      .refine(async (value: any) => {
        const isUnique = await checkServerUnique(value);
        return isUnique;
      }, "Server with this name already exists."),
    description: z
      .string()
      .min(50, "Description is too short")
      .max(200, "Description is too long"),
    tags: z
      .string()
      .array()
      .max(5, "Maximum 5 tags allowed.")
      .min(1, "Minimum 1 tag required."),
    isPublic: z.boolean().default(true),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverImage: undefined,
      name: "",
      description: "",
      tags: [],
      isPublic: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    values.serverImage && formData.append("serverImage", values.serverImage);
    formData.append("name", values.name);
    formData.append("description", values.description);

    formData.append("tags", JSON.stringify(values.tags));
    formData.append("isPublic", values.isPublic.toString());

    const error = await handleCreateServer(formData);

    if (!error) {
      // router.push(`/servers/${data?._id}`);

      // router refresh is required so that identity event emits again and the new
      // server is added in to the room

      router.refresh();

      toast.success("Server Created Successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

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
                          fileRef={fileInputRef}
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

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between rounded-md border px-4 py-3 mb-2 mt-6 bg-[#f3f3f3]">
                      Public Server
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-1"></div>
              <Button type="submit">Create Server</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
