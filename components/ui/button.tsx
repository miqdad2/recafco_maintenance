import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-teal-800",
    secondary: "border border-border bg-card text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:bg-red-700"
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
