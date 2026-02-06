import React from "react";
import { cn } from "@/lib/utils";
import type { SelectProps } from "@/types";

export function Select({
    label,
    value,
    onChange,
    options,
    placeholder,
    required = false,
    error,
    disabled = false,
    className,
}: SelectProps) {
    return (
        <div className={cn("w-full", className)}>
            <label className="institutional-label">
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className={cn(
                    "institutional-input",
                    error && "border-red-500 focus:ring-red-500"
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
