"use client";

import React from "react";

// Main Card Props
interface CardProps {
    children: React.ReactNode; // Children elements
    className?: string; // Optional className for custom styling
    style?: React.CSSProperties; // Optional style for inline styles
    onClick?: () => void; // Optional click handler
    isFlipped?: boolean; // Optional prop to control flip state
    isMatched?: boolean; // Optional prop to control matched state
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
const Card: React.FC<CardProps> = ({ children, className, style, onClick, isFlipped, isMatched }) => {
    return (
        <div
            className={`relative rounded-lg border bg-card text-card-foreground shadow-sm transform-style-3d transition-all duration-300 ${isMatched
                ? "bg-indigo-900/50 border-indigo-400/50"
                : isFlipped
                    ? "bg-indigo-800/50 border-indigo-500/50"
                    : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
                } ${className || ""}`}
            style={style}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5" />
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