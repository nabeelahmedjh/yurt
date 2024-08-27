import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightIconClassName?: string;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      rightIconClassName,
      type,
      leftIcon,
      rightIcon,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex relative w-full">
        {leftIcon && (
          <div className="flex absolute translate-x-[60%] translate-y-[50%] size-6">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            `flex h-12 w-full rounded-md border border-input bg-[#f3f3f3] ${
              leftIcon ? "pl-12" : "pl-3"
            } ${
              rightIcon ? "pr-12" : "pr-3"
            } py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/60 placeholder:text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all`,
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div
            className={cn(
              "cursor-pointer flex justify-center items-center absolute right-[5%] top-[10%]  size-10",
              rightIconClassName
            )}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
