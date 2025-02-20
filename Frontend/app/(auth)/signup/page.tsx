"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "./schema";
import { useState } from "react";
import {
  ArrowRight,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  Mail,
  UserRound,
} from "lucide-react";
import useSignup from "@/hooks/auth/useSignup";

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const { isLoading, handleSignup } = useSignup();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const error = await handleSignup(values);
    if (!error) {
      setVerifyMsg("Verification email sent. Please check your email.");
    }

    form.reset();
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-5xl bg-[#F2FED1] max-w-fit p-1 rounded-[8px] mb-32 font-medium">
          Sign Up.
        </CardTitle>
        <CardDescription className="font-medium text-gray-950 text-lg mb-4 whitespace-nowrap">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline hover:no-underline bg-[#ABF600] py-1 px-2 rounded-[8px] font-normal"
          >
            Login
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          leftIcon={<Mail strokeWidth={1.5} />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          leftIcon={<LockKeyholeIcon strokeWidth={1.5} />}
                          rightIcon={
                            showPassword ? (
                              <EyeOffIcon strokeWidth={1.5} />
                            ) : (
                              <EyeIcon strokeWidth={1.5} />
                            )
                          }
                          onRightIconClick={() =>
                            setShowPassword(!showPassword)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-green-600">{verifyMsg}</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <span className="mr-2 font-medium text-sm">
                  REGISTER
                  {<ArrowRight className="inline size-5 ml-1" />}
                </span>
                {isLoading && <LoaderCircleIcon className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
