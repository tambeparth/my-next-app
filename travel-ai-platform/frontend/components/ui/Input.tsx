import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
    variant?: 'default' | 'travel' | 'ocean' | 'sunset';
    size?: 'sm' | 'md' | 'lg';
}

export function Input({
    className,
    type,
    fullWidth = true,
    variant = 'default',
    size = 'md',
    ...props
}: InputProps) {
    return (
        <div className="relative">
            <input
                type={type}
                className={cn(
                    // Base styles
                    "rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-300",
                    "placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                    "shadow-soft hover:shadow-medium focus:shadow-travel",

                    // Variant styles
                    {
                        // Default - Clean and minimal
                        "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20": variant === 'default',

                        // Travel - Multi-color focus
                        "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-gradient-to-r focus:from-sky/5 focus:to-primary/5": variant === 'travel',

                        // Ocean - Blue themed
                        "border-primary/30 bg-sky/5 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:bg-primary/5": variant === 'ocean',

                        // Sunset - Orange themed
                        "border-secondary/30 bg-sand/20 focus:border-secondary focus:ring-2 focus:ring-secondary/30 focus:bg-secondary/5": variant === 'sunset',
                    },

                    // Size styles
                    {
                        "h-9 px-3 text-sm": size === 'sm',
                        "h-11 px-4 text-base": size === 'md',
                        "h-12 px-5 text-lg": size === 'lg',
                    },

                    fullWidth && "w-full",
                    className
                )}
                {...props}
            />

            {/* Travel-themed focus indicator */}
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 transition-opacity duration-300 focus-within:opacity-100">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-forest/10 blur-sm"></div>
            </div>
        </div>
    );
}
