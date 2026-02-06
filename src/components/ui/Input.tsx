import React from "react";
import { cn } from "@/lib/utils";
import type { InputProps } from "@/types";

export function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    className,
}: InputProps) {
    return (
        <div className={cn("w-full", className)}>
            <label className="institutional-label">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={cn(
                    "institutional-input",
                    error && "border-red-500 focus:ring-red-500"
                )}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
