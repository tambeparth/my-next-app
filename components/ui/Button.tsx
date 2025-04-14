import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "secondary" | "danger" | "success" | "ghost";
    size?: "default" | "sm" | "lg" | "xl";
}

export function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                // Variants
                variant === "default" && "bg-black text-white hover:bg-blue-500",
                variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-100",
                variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300",
                variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
                variant === "success" && "bg-green-600 text-white hover:bg-green-500",
                variant === "ghost" && "text-gray-700 hover:bg-gray-100",
                // Sizes
                size === "default" && "h-10 px-4 py-2",
                size === "sm" && "h-8 px-3 text-xs",
                size === "lg" && "h-12 px-6 text-lg",
                size === "xl" && "h-14 px-8 text-xl",
                className
            )}
            {...props}
        />
    );
}
