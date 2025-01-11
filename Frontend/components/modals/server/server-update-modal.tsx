"use client";

import { useEffect, useRef, useState } from "react";
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
import { Loader } from "lucide-react";

import useGetTags from "@/hooks/useGetTags";
import useGetServerById from "@/hooks/server/useGetServerById";

import useUpdateServer from "@/hooks/server/useUpdateServer";

import { getServers } from "@/ApiManager/apiMethods";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function ServerUpdateModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const MultiSelectConatinerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { handleUpdateServer, loading } = useUpdateServer();

  const { data: serverData } = useGetServerById();
  const { data: tagsOptions } = useGetTags();

  const tagsList = tagsOptions
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
    if (data.data.length === 0 || data.data[0].name === serverData[0].name) {
      return true;
    } else {
      return false;
    }
  };

  const formSchema = z.object({
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  useEffect(() => {
    const defaultTags = serverData?.[0].tags.map((tag: any) => tag._id);

    if (serverData && defaultTags) {
      form.reset({
        name: serverData?.[0].name,
        description: serverData?.[0].description,
        tags: defaultTags,
      });
    }
  }, [serverData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.name || !values.description || !values.tags) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("tags", JSON.stringify(values.tags));

    const error = await handleUpdateServer(formData);

    if (!error) {
      router.refresh();

      toast.success("Server Updated Successfully");

      form.reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        OverlayclassName="place-items-center"
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
          <div className="mt-3 ml-8">
            <DialogTitle className="bg-lime-100 w-fit px-2 py-1 rounded-[8px] font-medium">
              Update Server
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Update the server information
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 px-8">
          <Form {...form}>
            <form
              id="update-server-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 px-1"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="tribelord"
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
                        className="h-40"
                        placeholder="I am the lord of this tribe"
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
                    <FormLabel>Tags</FormLabel>
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
                        maxCount={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-1"></div>
              <Button disabled={loading} type="submit">
                {loading ? (
                  <span className="min-w-24 flex justify-center">
                    <Loader className="animate-spin" />
                  </span>
                ) : (
                  <p>Update Server</p>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
