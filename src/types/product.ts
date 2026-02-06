// Updated Product type with categories and vendor verification
export interface Product {
    id: string
    name: string
    price: number
    image_url?: string
    description?: string
    school_id?: string

    // New fields for categorization
    category: 'uniform' | 'notebook' | 'stationery' | 'bottle' | 'bag' | 'shoes' | 'general'
    is_official_vendor: boolean

    created_at?: string
    updated_at?: string
}

// Product variant for size options
export interface ProductVariant {
    id: string
    product_id: string
    variant_type: 'size' | 'custom'
    size?: string // 'S', 'M', 'L', 'XL', 'XXL', etc.
    price_modifier: number // Additional cost for this variant
    stock_quantity: number
    created_at?: string
    updated_at?: string
}

// Measurement rules for custom uniform tailoring
export interface MeasurementRule {
    id: string
    product_id: string
    measurement_name: string // 'chest', 'waist', 'height', 'sleeve', etc.
    unit: string // 'cm' or 'inch'
    min_value: number
    max_value: number
    instruction?: string // How to measure
    display_order: number
    created_at?: string
}

// Cart item with variant support
export interface CartItem {
    id: string
    product_id: string
    product: Product
    quantity: number

    // Variant information
    variant_type?: 'size' | 'custom'
    variant_id?: string // Reference to ProductVariant
    variant?: ProductVariant

    // Custom measurements
    custom_measurements?: Record<string, number> // { chest: 96, waist: 84, height: 175 }

    total_price: number
}

// Category configuration
export interface ProductCategory {
    id: string
    name: string
    slug: string
    icon: string
    display_order: number
    description?: string
}

// Category icons mapping
export const CATEGORY_CONFIG: Record<string, ProductCategory> = {
    uniform: {
        id: 'uniform',
        name: 'Uniforms',
        slug: 'uniform',
        icon: '👕',
        display_order: 1,
        description: 'School uniforms, shirts, pants, blazers'
    },
    shoes: {
        id: 'shoes',
        name: 'Shoes',
        slug: 'shoes',
        icon: '👞',
        display_order: 2,
        description: 'School shoes and sports shoes'
    },
    bag: {
        id: 'bag',
        name: 'Bags',
        slug: 'bag',
        icon: '🎒',
        display_order: 3,
        description: 'School bags and backpacks'
    },
    notebook: {
        id: 'notebook',
        name: 'Notebooks',
        slug: 'notebook',
        icon: '📓',
        display_order: 4,
        description: 'Notebooks, diaries, and registers'
    },
    stationery: {
        id: 'stationery',
        name: 'Stationery',
        slug: 'stationery',
        icon: '✏️',
        display_order: 5,
        description: 'Pens, pencils, erasers, rulers'
    },
    bottle: {
        id: 'bottle',
        name: 'Bottles',
        slug: 'bottle',
        icon: '💧',
        display_order: 6,
        description: 'Water bottles and flasks'
    },
    general: {
        id: 'general',
        name: 'Other Items',
        slug: 'general',
        icon: '📦',
        display_order: 99,
        description: 'Other school essentials'
    }
}

// Helper function to get category config
export function getCategoryConfig(category: string): ProductCategory {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.general
}

// Helper function to group products by category
export function groupProductsByCategory(products: Product[]): Record<string, Product[]> {
    return products.reduce((acc, product) => {
        const category = product.category || 'general'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(product)
        return acc
    }, {} as Record<string, Product[]>)
}
