// Core domain types for CampusKart

export interface School {
    id: string;
    slug: string;
    name: string;
    logo?: string;
    address: string;
    contact: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Class {
    id: string;
    schoolId: string;
    name: string;
    grade: string;
    section?: string;
    academicYear: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image?: string;
    sku: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductBundle {
    id: string;
    classId: string;
    name: string;
    description: string;
    products: BundleProduct[];
    totalPrice: number;
    discountedPrice?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BundleProduct {
    productId: string;
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    schoolId: string;
    classId: string;
    studentName: string;
    parentName: string;
    contactNumber: string;
    address: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    paymentMethod?: string;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

// UI Component types
export interface ButtonProps {
    variant?: "primary" | "secondary" | "accent";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}
