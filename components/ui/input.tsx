import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary/20 focus:ring-4",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary/20 focus:ring-4",
        className
      )}
      {...props}
    />
  );
}
