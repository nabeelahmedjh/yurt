"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companySize: z.string().min(1, "Please select a company size"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  productInterest: z.string().min(1, "Please select a product"),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  "Personal Information",
  "Company Details",
  "Product Preferences",
  "Confirmation",
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      companySize: "",
      industry: "",
      productInterest: "",
      termsAccepted: false,
    },
    mode: "onChange",
  });

  const {
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    alert("Onboarding complete! Check the console for form data.");
  };

  const nextStep = async () => {
    const fields = [
      ["firstName", "lastName", "email"],
      ["companyName", "companySize", "industry"],
      ["productInterest"],
      ["termsAccepted"],
    ][currentStep];

    const isValid = await trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      setValidatedSteps([...validatedSteps, currentStep]);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    const stepProps = {
      form,
      isValidated: validatedSteps.includes(currentStep),
    };

    switch (currentStep) {
      case 0:
        return <PersonalInformation {...stepProps} />;
      case 1:
        return <CompanyDetails {...stepProps} />;
      case 2:
        return <ProductPreferences {...stepProps} />;
      case 3:
        return <Confirmation {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>SaaS Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`text-sm font-medium ${
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>{renderStep()}</form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function PersonalInformation({
  form,
  isValidated,
}: {
  form: any;
  isValidated: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {isValidated && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {isValidated && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            {isValidated && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

function CompanyDetails({
  form,
  isValidated,
}: {
  form: any;
  isValidated: boolean;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {isValidated && <FormMessage />}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501+">501+ employees</SelectItem>
              </SelectContent>
            </Select>
            {isValidated && <FormMessage />}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {isValidated && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

function ProductPreferences({
  form,
  isValidated,
}: {
  form: any;
  isValidated: boolean;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="productInterest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Which product are you interested in?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Product A" />
                  </FormControl>
                  <FormLabel className="font-normal">Product A</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Product B" />
                  </FormControl>
                  <FormLabel className="font-normal">Product B</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Product C" />
                  </FormControl>
                  <FormLabel className="font-normal">Product C</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            {isValidated && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

function Confirmation({
  form,
  isValidated,
}: {
  form: any;
  isValidated: boolean;
}) {
  const formData = form.watch();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Please review your information:</h3>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {formData.firstName} {formData.lastName}
        </p>
        <p>
          <strong>Email:</strong> {formData.email}
        </p>
        <p>
          <strong>Company:</strong> {formData.companyName}
        </p>
        <p>
          <strong>Company Size:</strong> {formData.companySize}
        </p>
        <p>
          <strong>Industry:</strong> {formData.industry}
        </p>
        <p>
          <strong>Product Interest:</strong> {formData.productInterest}
        </p>
      </div>
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Accept terms and conditions</FormLabel>
            </div>
          </FormItem>
        )}
      />
      {isValidated && <FormMessage />}
    </div>
  );
}
