import React from "react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "outline-white";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "uppercase cursor-pointer inline-flex items-center justify-center font-black tracking-wider transition-all border-4 rounded-xl";

    const variants = {
      primary:
        "bg-[#cc7cf7] text-white border-brand-secondary shadow-[4px_4px_0_0_#1a1025] hover:shadow-[0px_0px_0_0_#1a1025] hover:translate-x-[4px] hover:translate-y-[4px]",
      secondary:
        "bg-white text-brand-secondary border-brand-secondary shadow-[4px_4px_0_0_#1a1025] hover:shadow-[0px_0px_0_0_#1a1025] hover:translate-x-[4px] hover:translate-y-[4px]",
      accent:
        "bg-[#cc7cf7] text-white border-brand-secondary shadow-[4px_4px_0_0_#1a1025] hover:shadow-[0px_0px_0_0_#1a1025] hover:translate-x-[4px] hover:translate-y-[4px]",
      outline:
        "bg-transparent text-brand-secondary border-brand-secondary shadow-[4px_4px_0_0_#1a1025] hover:shadow-[0px_0px_0_0_#1a1025] hover:translate-x-[4px] hover:translate-y-[4px]",
      "outline-white": 
        "bg-transparent text-white border-white shadow-[4px_4px_0_0_white] hover:shadow-[0px_0px_0_0_white] hover:translate-x-[4px] hover:translate-y-[4px]",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] md:text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-6 sm:px-10 py-4 sm:py-6 text-lg md:text-xl tracking-widest",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
