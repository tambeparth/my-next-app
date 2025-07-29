import * as React from "react";
import { cn } from "@/lib/utils"; // Utility for class merging

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="aspect-square h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        {fallback}
                    </div>
                )}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
    ({ className, ...props }, ref) => {
        return (
            <img
                ref={ref}
                className={cn("aspect-square h-full w-full", className)}
                {...props}
            />
        );
    }
);

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> { }

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
    ({ className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
                    className
                )}
                {...props}
            />
        );
    }
);

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };