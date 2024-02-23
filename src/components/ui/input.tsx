import * as React from "react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      // variant: {
      //   default: "bg-primary text-primary-foreground hover:bg-primary/90",
      //   destructive:
      //     "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      //   outline:
      //     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      //   secondary:
      //     "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      //   ghost: "hover:bg-accent hover:text-accent-foreground",
      //   link: "text-primary underline-offset-4 hover:underline",
      // },
      variant: {
        default: "h-10 px-3 py-2",
        sm: "h-6 rounded-sm px-2",
        lg: "h-11 px-4",
      },
    },
    defaultVariants: {
      // variant: "default",
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            className,
            variant,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
