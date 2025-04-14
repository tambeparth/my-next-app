import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline" | "success" | "warning" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                // Variants
                variant === "default" && "border-transparent bg-black text-white",
                variant === "outline" && "border-gray-300 text-gray-700",
                variant === "success" && "border-green-500 bg-green-100 text-green-800",
                variant === "warning" && "border-yellow-500 bg-yellow-100 text-yellow-800",
                variant === "danger" && "border-red-500 bg-red-100 text-red-800",
                className
            )}
            {...props}
        />
    );
}
