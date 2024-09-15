"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-neutral-400",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      asChild
      className={cn(
        "pointer-events-none block h-5 w-5  rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 [&_.switch-x-icon]:data-[state=checked]:opacity-0 [&_.switch-check-icon]:data-[state=unchecked]:opacity-0"
      )}
    >
      <span className="relative">
        <X
          strokeWidth={3}
          size={14}
          className="absolute top-[16%] right-[14%] switch-x-icon transition-opacity"
        />
        <Check
          strokeWidth={3}
          size={14}
          className="absolute top-[16%] right-[14%] switch-check-icon transition-opacity"
        />
      </span>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
