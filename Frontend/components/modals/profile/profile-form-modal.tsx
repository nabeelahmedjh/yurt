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
import useGetProfile from "@/hooks/user/useGetProfile";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import { getUsers } from "@/ApiManager/apiMethods";
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function ProfileFormModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const MultiSelectConatinerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { handleUpdateProfile, loading } = useUpdateProfile();

  const { data: profileData } = useGetProfile();
  const { data: tagsOptions } = useGetTags();

  const tagsList = tagsOptions
    ?.sort((a: any, b: any) => b.usageCount - a.usageCount)
    .map((tag: any) => ({
      value: tag._id,
      label: `${tag.name}  (${tag.usageCount})`,
    }));

  const checkUsernameUnique = async (username: string) => {
    // console.log("username", username);
    const data: any = await getUsers({
      searchType: "strict",
      username: username,
    });
    if (
      data.data.length === 0 ||
      data.data[0].username === profileData?.username
    ) {
      return true;
    } else {
      return false;
    }
  };

  const formSchema = z.object({
    username: z
      .string()
      .min(2, "Username is too short")
      .max(50, "Username is too long")
      .refine(async (value: any) => {
        const isUnique = await checkUsernameUnique(value);
        return isUnique;
      }, "Username already exists."),
    bio: z.string().min(25, "Bio is too short").max(400, "Bio is too long"),
    interests: z
      .string()
      .array()
      .max(5, "Maximum 5 interests allowed.")
      .min(1, "Minimum 1 interest required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      interests: [],
    },
  });

  useEffect(() => {
    const defaultTags = profileData?.interests.map((tag: any) => tag._id);

    if (profileData && defaultTags) {
      form.reset({
        username: profileData.username,
        bio: profileData.bio,
        interests: defaultTags,
      });
    }
  }, [profileData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const error = await handleUpdateProfile(values);

    if (!error) {
      router.refresh();

      toast.success("Profile Updated Successfully");

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
              Update Profile
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 px-8">
          <Form {...form}>
            <form
              id="update-profile-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 px-1"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
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
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl ref={MultiSelectConatinerRef}>
                      <MultiSelect
                        popoverPortalContainerRef={MultiSelectConatinerRef}
                        modalPopover={true}
                        options={tagsList}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select Interests"
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
                  <p>Update Profile</p>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
