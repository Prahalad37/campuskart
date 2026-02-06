import { z } from 'zod'

// Product schema with categories
export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be positive'),
    image_url: z.string().url().optional(),
    description: z.string().optional(),
    school_id: z.string().uuid().optional(),

    category: z.enum([
        'uniform',
        'notebook',
        'stationery',
        'bottle',
        'bag',
        'shoes',
        'general'
    ]).default('general'),

    is_official_vendor: z.boolean().default(false),

    created_at: z.string().optional(),
    updated_at: z.string().optional()
})

// Product variant schema
export const ProductVariantSchema = z.object({
    id: z.string().uuid(),
    product_id: z.string().uuid(),
    variant_type: z.enum(['size', 'custom']),
    size: z.string().optional(),
    price_modifier: z.number().default(0),
    stock_quantity: z.number().int().min(0).default(0),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
})

// Measurement rule schema
export const MeasurementRuleSchema = z.object({
    id: z.string().uuid(),
    product_id: z.string().uuid(),
    measurement_name: z.string(),
    unit: z.enum(['cm', 'inch']).default('cm'),
    min_value: z.number().min(0),
    max_value: z.number().positive(),
    instruction: z.string().optional(),
    display_order: z.number().int().default(0),
    created_at: z.string().optional()
})

// Custom measurements input schema
export const CustomMeasurementsSchema = z.record(
    z.string(),
    z.number().positive('Measurement must be positive')
).refine(
    (data) => Object.keys(data).length > 0,
    'At least one measurement is required'
)

// Cart item schema with variants
export const CartItemSchema = z.object({
    id: z.string(),
    product_id: z.string().uuid(),
    quantity: z.number().int().positive().default(1),

    variant_type: z.enum(['size', 'custom']).optional(),
    variant_id: z.string().uuid().optional(),
    custom_measurements: CustomMeasurementsSchema.optional(),

    total_price: z.number().positive()
})

// Form schema for adding product to cart with size
export const AddToCartSizeSchema = z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid(),
    quantity: z.number().int().positive().min(1).max(99).default(1)
})

// Form schema for adding product to cart with custom measurements
export const AddToCartCustomSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive().min(1).max(99).default(1),
    custom_measurements: CustomMeasurementsSchema
})

// Export types inferred from schemas
export type Product = z.infer<typeof ProductSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
export type MeasurementRule = z.infer<typeof MeasurementRuleSchema>
export type CustomMeasurements = z.infer<typeof CustomMeasurementsSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type AddToCartSizeInput = z.infer<typeof AddToCartSizeSchema>
export type AddToCartCustomInput = z.infer<typeof AddToCartCustomSchema>
