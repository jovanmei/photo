import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "underline" | "solid";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ghost", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer uppercase tracking-[0.2em] text-[10px] font-bold",
          variant === "ghost" && "border border-black/20 hover:border-black px-8 py-4 bg-transparent",
          variant === "underline" && "relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all pb-1",
          variant === "solid" && "bg-black text-white px-8 py-4 hover:bg-neutral-800",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex w-full bg-transparent border-b border-black/20 py-2 text-sm transition-colors focus:border-black focus:outline-none placeholder:text-neutral-400 uppercase tracking-widest text-[11px]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full bg-transparent border-b border-black/20 py-2 text-sm transition-colors focus:border-black focus:outline-none placeholder:text-neutral-400 resize-none uppercase tracking-widest text-[11px]",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Divider = ({ className }: { className?: string }) => (
  <div className={cn("h-[1px] w-full bg-black/5", className)} />
);
