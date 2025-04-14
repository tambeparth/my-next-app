"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
    variant?: "default" | "outline" | "success" | "warning" | "danger";
    thumbClassName?: string;
    trackClassName?: string;
    showTooltip?: boolean;
    className?: string;
    type?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: number[]; // Accepting number array
    onValueChange?: (value: number[]) => void; // Callback function for number array
}

export function Slider({
    className,
    variant = "default",
    thumbClassName,
    trackClassName,
    showTooltip = false,
    value = [0], // Default value is an array with one number
    onValueChange,
    ...props
}: SliderProps) {
    const [internalValue, setInternalValue] = React.useState<number>(value[0]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setInternalValue(newValue);
        if (onValueChange) onValueChange([newValue]); // Passing as number array
    };

    return (
        <div className="relative w-full">
            {/* Track */}
            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full",
                    variant === "default" && "bg-gray-200",
                    variant === "outline" && "border border-gray-300 bg-transparent",
                    variant === "success" && "bg-green-100",
                    variant === "warning" && "bg-yellow-100",
                    variant === "danger" && "bg-red-100",
                    trackClassName
                )}
            />

            {/* Thumb and Range Input */}
            <input
                type="range"
                className={cn(
                    "appearance-none w-full h-2 bg-transparent relative z-10 focus:outline-none",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all",
                    variant === "default" &&
                    "[&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:hover:bg-gray-800",
                    variant === "outline" &&
                    "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:hover:bg-gray-50",
                    variant === "success" &&
                    "[&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:hover:bg-green-600",
                    variant === "warning" &&
                    "[&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:hover:bg-yellow-600",
                    variant === "danger" &&
                    "[&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:hover:bg-red-600",
                    thumbClassName,
                    className
                )}
                value={internalValue}
                onChange={handleChange}
                {...props}
            />

            {/* Tooltip */}
            {showTooltip && (
                <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                    style={{ left: `${(internalValue / Number(props.max)) * 100}%` }}
                >
                    {internalValue}
                </div>
            )}
        </div>
    );
}
