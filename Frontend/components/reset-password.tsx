"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useUpdateProfile from "@/hooks/user/useUpdateProfile";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockKeyholeIcon } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ResetPassword() {
  const router = useRouter();

  const { handleUpdateProfile, loading } = useUpdateProfile();

  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    console.log(data);

    const error: any = await handleUpdateProfile({
      password: data.password,
    });

    if (!error) {
      router.push("/servers");
      setResetSuccessful(true);
    }
  }

  return (
    <div className="py-8 md:px-8 md:py-16">
      <div className="space-y-16 p-4">
        <div>
          <h2 className="text-2xl font-medium bg-primary w-max px-1 rounded-[4px]">
            Reset Password
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      leftIcon={<LockKeyholeIcon strokeWidth={1.5} />}
                      rightIcon={
                        showPassword ? (
                          <EyeOffIcon strokeWidth={1.5} />
                        ) : (
                          <EyeIcon strokeWidth={1.5} />
                        )
                      }
                      onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      leftIcon={<LockKeyholeIcon strokeWidth={1.5} />}
                      rightIcon={
                        showPassword ? (
                          <EyeOffIcon strokeWidth={1.5} />
                        ) : (
                          <EyeIcon strokeWidth={1.5} />
                        )
                      }
                      onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {resetSuccessful && (
                <p className="bg-secondary text-sm">
                  Password reset successful. Redirecting to Home page.
                </p>
              )}
            </div>
            <Button disabled={loading} type="submit">
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
