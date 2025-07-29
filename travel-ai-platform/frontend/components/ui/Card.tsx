"use client";

import React from "react";

// Main Card Props
interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    isFlipped?: boolean;
    isMatched?: boolean;
    variant?: 'default' | 'travel' | 'ocean' | 'sunset' | 'forest' | 'glass';
    hover?: boolean;
}

// Card Subcomponents Props
interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

// Main Card Component
const Card: React.FC<CardProps> = ({
    children,
    className,
    style,
    onClick,
    isFlipped,
    isMatched,
    variant = 'default',
    hover = true
}) => {
    const getVariantClasses = () => {
        if (isMatched) return "bg-forest/20 border-forest/40 shadow-forest";
        if (isFlipped) return "bg-primary/20 border-primary/40 shadow-primary";

        switch (variant) {
            case 'travel':
                return "bg-white border-gray-200 shadow-travel hover:shadow-xl hover:border-primary/30 hover:bg-gradient-to-br hover:from-sky/5 hover:to-primary/5";
            case 'ocean':
                return "bg-gradient-to-br from-sky/10 to-primary/5 border-primary/20 shadow-primary hover:shadow-xl hover:border-primary/40";
            case 'sunset':
                return "bg-gradient-to-br from-sand/20 to-secondary/5 border-secondary/20 shadow-secondary hover:shadow-xl hover:border-secondary/40";
            case 'forest':
                return "bg-gradient-to-br from-forest/5 to-forest/10 border-forest/20 shadow-forest hover:shadow-xl hover:border-forest/40";
            case 'glass':
                return "bg-white/80 backdrop-blur-md border-white/20 shadow-soft hover:shadow-medium hover:bg-white/90";
            default:
                return "bg-white border-gray-200 shadow-soft hover:shadow-medium hover:border-gray-300";
        }
    };

    return (
        <div
            className={`
                relative rounded-xl border text-card-foreground
                transform-style-3d transition-all duration-500 ease-out
                ${hover ? 'hover:scale-105 hover:-translate-y-1' : ''}
                ${onClick ? 'cursor-pointer' : ''}
                ${getVariantClasses()}
                ${className || ""}
            `}
            style={style}
            onClick={onClick}
        >
            {/* Travel-themed gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect for travel cards */}
            {variant === 'travel' && (
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>
            )}

            {children}
        </div>
    );
};

// Card Subcomponents
const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}>
            {children}
        </div>
    );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`}>
            {children}
        </h3>
    );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
    return (
        <p className={`text-sm text-muted-foreground ${className || ""}`}>
            {children}
        </p>
    );
};

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div className={`p-6 pt-0 ${className || ""}`}>
            {children}
        </div>
    );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div className={`flex items-center p-6 pt-0 ${className || ""}`}>
            {children}
        </div>
    );
};

// Export all components
export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};