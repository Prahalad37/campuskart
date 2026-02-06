import React from "react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/types";

export function Button({
    variant = "primary",
    size = "md",
    children,
    onClick,
    disabled = false,
    type = "button",
    className,
}: ButtonProps) {
    const baseStyles = "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tap-highlight-transparent";

    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary",
        secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary",
        accent: "bg-accent text-white hover:bg-accent-600 focus:ring-accent",
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </button>
    );
}
