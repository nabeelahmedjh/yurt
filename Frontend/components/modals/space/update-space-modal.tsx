"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

import useUpdateSpace from "@/hooks/space/useUpdateSpace";
import UploadAvatar from "@/components/image-uploader/upload-avatar";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function UpdateSpaceModal({
  children,
  spaceData,
}: {
  children: React.ReactNode;
  spaceData: any;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { handleUpdateSpace } = useUpdateSpace();

  const MAX_FILE_SIZE_MB = 1;
  const formSchema = z.object({
    spaceImage: z
      .union([z.instanceof(File), z.undefined()])
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spaceImage: undefined,
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (spaceData) {
      form.reset({
        name: spaceData?.name,
        description: spaceData?.description,
      });
    }
  }, [spaceData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!spaceData) return;

    const formData = new FormData();
    values.spaceImage && formData.append("spaceImage", values.spaceImage);
    formData.append("name", values.name);
    formData.append("description", values.description);

    const error = await handleUpdateSpace(spaceData._id, formData);

    if (!error) {
      router.refresh();

      toast.success("Space Updated Successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      form.reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mt-3">
            <DialogTitle className="bg-lime-100 w-fit px-2 py-1 rounded-[8px] font-medium">
              Update Space
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Update the space information
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              id="update-space"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 px-1"
            >
              <FormField
                control={form.control}
                name="spaceImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <div className="mt-4 flex flex-col items-center">
                        <UploadAvatar
                          defaultAvatar={spaceData?.spaceImage?.source}
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

              <div className="p-1"></div>
              <Button type="submit">Update Space</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
