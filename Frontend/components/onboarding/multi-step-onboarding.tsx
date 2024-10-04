"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";

import { Button } from "@/components/ui/button";

import useGetTags from "@/hooks/useGetTags";
import useGetProfile from "@/hooks/user/useGetProfile";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import { getUsers } from "@/ApiManager/apiMethods";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const steps = [
  {
    fields: [],
    illustration: "/onboarding-step1.svg",
  },
  {
    fields: ["username", "interests"],
    illustration: "/onboarding-step2.svg",
  },
  {
    fields: ["bio"],
    illustration: "/onboarding-step3.svg",
  },
  {
    fields: ["educationalEmail"],
    illustration: "/onboarding-step4.svg",
  },
  {
    illustration: "/onboarding-step5.svg",
  },
];

export default function MultiStepForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isEducationalEmail, setIsEducationalEmail] = useState(false);
  const delta = currentStep - previousStep;

  const MultiSelectConatinerRef = useRef(null);

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

  const FormDataSchema = z.object({
    username: z
      .string()
      .min(2, "Username is too short")
      .max(50, "Username is too long")
      .refine(async (value: any) => {
        const isUnique = await checkUsernameUnique(value);
        return isUnique;
      }, "Username already exists."),
    interests: z
      .string()
      .array()
      .max(5, "Maximum 5 interests allowed.")
      .min(1, "Minimum 1 interest required."),
    bio: z.string().min(100, "Bio is too short").max(400, "Bio is too long"),
    educationalEmail: z.string().refine(
      (email) => {
        if (email === "") return true;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) return false;
        // uncomment below to bypass edu check
        // return true;
        const atIndex = email.indexOf("@");
        return email.slice(atIndex).toLowerCase().includes("edu");
      },
      {
        message:
          "Please enter a valid educational email address. It should contain 'edu'.",
      }
    ),
  });

  type Inputs = z.infer<typeof FormDataSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      username: "",
      interests: [],
      bio: "",
      educationalEmail: "",
    },
  });

  useEffect(() => {
    const defaultTags = profileData?.interests.map((tag: any) => tag._id);

    if (profileData && defaultTags) {
      form.reset({
        username: profileData.username,
        interests: defaultTags,
        bio: profileData.bio,
        educationalEmail:
          profileData.educationalDetails?.educationalEmail ?? "",
      });
    }
  }, [profileData, form]);

  const processForm = (data: Inputs) => {
    handleUpdateProfile(data);

    console.log("educationalEmail", data.educationalEmail);
    if (data.educationalEmail === "") {
      console.log("No email, redirecting to servers");
      router.push("/servers");
    } else {
      setIsEducationalEmail(true);
    }

    console.log("formData", data);

    form.reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    // currentStep starts from 0, so first step is 0
    if (currentStep === steps.length - 2) {
      await form.handleSubmit(processForm)();
    }
    setPreviousStep(currentStep);
    setCurrentStep((step) => step + 1);
  };

  const prev = async () => {
    setPreviousStep(currentStep);
    setCurrentStep((step) => step - 1);
  };

  return (
    <section className="flex flex-col justify-between pt-6 pb-4 px-8 sm:px-12 min-h-[80vh] max-h-[600px] w-[90vw] max-w-[1000px]">
      <div className="flex items-center justify-between md:gap-16">
        <div className="w-full flex flex-col h-[450px] justify-between">
          {/* Form */}
          <Form {...form}>
            <form
              // next button will submit the form not this
              // onSubmit={form.handleSubmit(processForm)}
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 py-4"
            >
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-28 flex flex-col justify-center items-center gap-4"
                >
                  <h2 className="text-[clamp(16px,4vw,38px)] font-medium bg-secondary p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                    Welcome to Yurt
                  </h2>
                  <p className="text-[clamp(12px,1.8vw,16px)] font-medium leading-6 text-gray-800">
                    Your collaborative learning platform
                  </p>
                  <Button
                    className="px-8 sm:px-12 group mt-12 text-lime-950 bg-primary"
                    type="button"
                    onClick={next}
                  >
                    Get Started{" "}
                    <ChevronRightIcon className="size-6 group-hover:ml-1 transition-[margin]" />
                  </Button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-[clamp(16px,3vw,28px)] font-medium bg-secondary p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                    Tell us about yourself
                  </h2>

                  <div className="mt-12 space-y-8">
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
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interests</FormLabel>
                          <FormControl ref={MultiSelectConatinerRef}>
                            <MultiSelect
                              popoverPortalContainerRef={
                                MultiSelectConatinerRef
                              }
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
                    <p className="text-gray-500 text-xs !mt-4">
                      * Username and interests will be publicly visible.
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-[clamp(16px,3vw,28px)] font-medium bg-secondary p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                    A few words about you
                  </h2>
                  <p className="mt-6 text-sm leading-6 text-gray-600">
                    Take a moment to set up your bio to help others connect with
                    you. You can always change it later!
                  </p>

                  <div className="mt-10">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              className="h-32"
                              placeholder="I am the lord of this tribe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-[clamp(16px,2.8vw,28px)] font-medium bg-secondary p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                    Your educational email
                  </h2>

                  <p className="mt-6 text-sm leading-6 text-gray-600">
                    Verifying your email helps us confirm whether you&apos;re a
                    student or teacher, unlocking all app functionality. Feel
                    free to skip, but full access awaits when you verify!
                  </p>

                  <div className="mt-10">
                    <FormField
                      control={form.control}
                      name="educationalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educational Email (optional)</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isEducationalEmail ? (
                    <div className="flex flex-col items-center md:items-start mt-24 gap-4 md:ml-8">
                      <h2 className="text-[clamp(16px,2.3vw,28px)] font-medium bg-secondary mb-8 p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                        Check Your Email Box
                      </h2>
                      <p className="mt-1 text-[clamp(12px,1.5vw,20px)] font-medium leading-6 text-gray-600">
                        A verification link has been sent.
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-gray-600">
                        Please check your inbox and click the link to verify
                        your email
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center md:items-start mt-24 gap-4 md:ml-8">
                      <h2 className="text-[clamp(16px,2.3vw,28px)] font-medium bg-secondary mb-8 p-2 w-fit rounded-[8px] leading-7 text-gray-900">
                        Onboarding Complete 🎉
                      </h2>
                      <p className="mt-1 text-[clamp(16px,1.5vw,28px)] font-medium leading-6 text-gray-600">
                        Redirecting...
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please wait while we redirect you.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </form>
          </Form>
          {/* Navigation */}
          <div
            className={`${
              currentStep === 4 || currentStep === 0 ? "hidden" : ""
            }`}
          >
            <div className="flex justify-between">
              <Button
                className="sm:px-6"
                type="button"
                onClick={prev}
                variant="outline"
              >
                <ChevronLeftIcon className="size-5" />
                Previous
              </Button>
              <Button className="sm:px-8" type="button" onClick={next}>
                Next <ChevronRightIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Illustrations */}
        <motion.div
          key={currentStep}
          initial={{ x: delta >= 0 ? "10%" : "-10%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: delta >= 0 ? "-10%" : "10%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-none"
        >
          <Image
            alt="illustration"
            className=" hidden md:block md:size-[35vw] lg:size-[400px]"
            width={400}
            height={400}
            src={steps[currentStep].illustration}
          />
        </motion.div>
      </div>

      {/* Steps */}
      <div
        className={`${
          currentStep === 4 ? "hidden" : ""
        } mt-8 w-full flex justify-center`}
      >
        <span>
          {currentStep + 1} of {steps.length}
        </span>
      </div>
    </section>
  );
}
