import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
}

export function Input({ className, type, fullWidth = true, ...props }: InputProps) {
    return (
        <input
            type={type}
            className={cn(
                "h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 dark:bg-white dark:border-gray-700 dark:placeholder-gray-500 dark:focus:ring-white",
                fullWidth && "w-full",
                className
            )}
            {...props}
        />
    );
}
