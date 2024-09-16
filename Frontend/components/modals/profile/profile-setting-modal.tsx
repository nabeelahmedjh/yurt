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

import UploadAvatar from "@/components/image-uploader/upload-avatar";
import useUpdateAvatar from "@/hooks/user/useUpdateAvatar";
import useGetProfile from "@/hooks/user/useGetProfile";
import ProfileFormModal from "@/components/modals/profile/profile-form-modal";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ConfirmAlert from "@/components/confirm-alert";
import useDeleteProfile from "@/hooks/user/useDeleteProfile";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function ProfileSettingModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleUpdateAvatar, loading } = useUpdateAvatar();
  const { data: profileData } = useGetProfile();
  const { handleDeleteProfile, loading: loadingDeleteProfile } =
    useDeleteProfile();

  const MAX_FILE_SIZE_MB = 1;

  const formSchema = z.object({
    avatar: z
      .union([z.instanceof(File), z.undefined()])
      .refine((file) => file !== undefined, "avatar is required.")
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
      avatar: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.avatar) return;

    const formData = new FormData();
    formData.append("avatar", values.avatar);

    const error = await handleUpdateAvatar(formData);

    if (!error) {
      toast.success("Avatar Updated Successfully");

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
              Profile
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            View your profile information
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Avatar</FormLabel>
                    <FormControl>
                      <div className="flex flex-col justify-center items-center">
                        <UploadAvatar
                          defaultAvatar={profileData?.avatar?.source}
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
        <div className="flex flex-col justify-center items-center">
          <p className="font-semibold text-lg"> {profileData?.username} </p>
          <p className="text-gray-500"> {profileData?.email} </p>
        </div>
        <div className="mt-8">
          <div className="min-h-44 mb-8 w-full">
            <div className="w-full py-3 flex">
              <h3 className="font-medium bg-lime-200 rounded-[4px] w-fit px-1 underline text-nowrap">
                About Me
              </h3>
              <div className="w-full mt-[1.2rem]">
                <Separator className="bg-gray-300" />
              </div>
            </div>
            <p className="break-words">{profileData?.bio}</p>
          </div>
          <div className="mb-8">
            <div className="w-full py-3 flex">
              <h3 className="font-medium bg-lime-200 rounded-[4px] w-fit px-1 underline">
                Interests
              </h3>
              <div className="w-full mt-[1.2rem]">
                <Separator className="bg-gray-300" />
              </div>
            </div>
            <div className="py-2 mb-2 flex flex-wrap gap-2">
              {profileData?.interests.map((interest: any) => (
                <span
                  key={interest._id}
                  className=" border-gray-400 border-2 text-gray-500 rounded-full px-6 py-1"
                >
                  {interest.name}
                </span>
              ))}
            </div>
            <Separator className="bg-gray-300" />
          </div>
          <div className="flex justify-end">
            <ProfileFormModal>
              <Button className="px-16 h-10 text-base">Edit</Button>
            </ProfileFormModal>
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
                      <ConfirmAlert
                        title="Delete Account"
                        descripton="Are you sure you want to delete your account?"
                        action={async () => {
                          await handleDeleteProfile();
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
                          <p>
                            {loadingDeleteProfile
                              ? "Deleting..."
                              : "Delete Account"}
                          </p>
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
