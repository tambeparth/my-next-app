"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

// Define the Toast type
type Toast = {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
};

// Define the Toast context type
type ToastContextType = {
    [x: string]: any;
    toasts: Toast[];
    addToast: (message: string, type: Toast["type"], duration?: number) => void;
    removeToast: (id: string) => void;
};

// Create the Toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Function to add a toast
    const addToast = (message: string, type: Toast["type"], duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type, duration };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Automatically remove the toast after the specified duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    // Function to remove a toast
    const removeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Render toasts using a portal */}
            {createPortal(
                <div className="fixed bottom-4 right-4 space-y-2 z-50">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

// Toast Item component
const ToastItem = ({ toast }: { toast: Toast }) => {
    const { removeToast } = useToast();

    // Determine the toast style based on its type
    const toastStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
        warning: "bg-yellow-500 text-black",
    };

    return (
        <div
            className={`p-4 rounded-md shadow-lg ${toastStyles[toast.type]}`}
            onClick={() => removeToast(toast.id)}
        >
            {toast.message}
        </div>
    );
};

// Custom hook to use the Toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};