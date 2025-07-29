import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline" | "success" | "warning" | "danger" | "primary" | "secondary" | "travel" | "ocean" | "sunset" | "forest";
    size?: "sm" | "md" | "lg";
    glow?: boolean;
}

export function Badge({
    className,
    variant = "default",
    size = "md",
    glow = false,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                // Base styles
                "inline-flex items-center rounded-full border font-semibold transition-all duration-300 relative overflow-hidden",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",

                // Size variants
                {
                    "px-2 py-0.5 text-xs": size === "sm",
                    "px-3 py-1 text-sm": size === "md",
                    "px-4 py-1.5 text-base": size === "lg",
                },

                // Glow effect
                glow && "animate-pulse",

                // Variant styles
                {
                    // Default variants
                    "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "default",
                    "border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50": variant === "outline",
                    "border-green-500 bg-green-100 text-green-800 hover:bg-green-200": variant === "success",
                    "border-yellow-500 bg-yellow-100 text-yellow-800 hover:bg-yellow-200": variant === "warning",
                    "border-red-500 bg-red-100 text-red-800 hover:bg-red-200": variant === "danger",

                    // Travel-themed variants
                    "border-transparent bg-primary text-white shadow-primary hover:bg-primary-dark hover:shadow-lg": variant === "primary",
                    "border-transparent bg-secondary text-white shadow-secondary hover:bg-secondary-dark hover:shadow-lg": variant === "secondary",
                    "border-transparent bg-gradient-travel text-white shadow-travel hover:shadow-xl": variant === "travel",
                    "border-transparent bg-gradient-ocean text-white shadow-primary hover:shadow-xl": variant === "ocean",
                    "border-transparent bg-gradient-sunset text-white shadow-secondary hover:shadow-xl": variant === "sunset",
                    "border-transparent bg-forest text-white shadow-forest hover:shadow-lg": variant === "forest",
                },

                className
            )}
            {...props}
        >
            {/* Travel-themed shimmer effect */}
            {(variant === "travel" || variant === "ocean" || variant === "sunset") && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
            )}

            <span className="relative z-10">{props.children}</span>
        </span>
    );
}
