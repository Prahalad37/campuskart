import React from "react";
import { cn } from "@/lib/utils";
import type { CardProps } from "@/types";

export function Card({ children, className, onClick }: CardProps) {
    const isClickable = !!onClick;

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-lg shadow-card p-6 border border-gray-100",
                isClickable && "cursor-pointer hover:shadow-elevated transition-shadow",
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("mb-4", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={cn("text-xl font-semibold text-primary", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("text-secondary", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("mt-4 pt-4 border-t border-gray-100", className)}>
            {children}
        </div>
    );
}
