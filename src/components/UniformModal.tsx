'use client'

import { useState, useEffect } from 'react'
import { Product, ProductVariant, MeasurementRule } from '@/types/product'
import { supabase } from '@/lib/supabase/client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check, Ruler } from 'lucide-react'

interface UniformModalProps {
    product: Product
    isOpen: boolean
    onClose: () => void
    onAddToCart: (productId: string, variantId?: string, measurements?: Record<string, number>) => void
}

export function UniformModal({ product, isOpen, onClose, onAddToCart }: UniformModalProps) {
    const [mode, setMode] = useState<'size' | 'custom'>('size')
    const [variants, setVariants] = useState<ProductVariant[]>([])
    const [measurementRules, setMeasurementRules] = useState<MeasurementRule[]>([])
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
    const [customMeasurements, setCustomMeasurements] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen, product.id])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch variants and measurement rules in parallel
            const [variantsRes, rulesRes] = await Promise.all([
                supabase
                    .from('product_variants')
                    .select('*')
                    .eq('product_id', product.id)
                    .eq('variant_type', 'size')
                    .order('size'),
                supabase
                    .from('measurement_rules')
                    .select('*')
                    .eq('product_id', product.id)
                    .order('display_order')
            ])

            if (variantsRes.data) setVariants(variantsRes.data)
            if (rulesRes.data) setMeasurementRules(rulesRes.data)
        } catch (error) {
            console.error('Error fetching customization data:', error)
        } finally {
            setLoading(false)
        }
    }

    const validateMeasurement = (rule: MeasurementRule, value: number): string | null => {
        if (value < rule.min_value) {
            return `Minimum ${rule.min_value}${rule.unit}`
        }
        if (value > rule.max_value) {
            return `Maximum ${rule.max_value}${rule.unit}`
        }
        return null
    }

    const handleMeasurementChange = (key: string, value: string) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
            setCustomMeasurements(prev => {
                const newMeasurements = { ...prev }
                delete newMeasurements[key]
                return newMeasurements
            })
            return
        }

        setCustomMeasurements(prev => ({ ...prev, [key]: numValue }))

        // Validate
        const rule = measurementRules.find(r => r.measurement_name === key)
        if (rule) {
            const error = validateMeasurement(rule, numValue)
            setErrors(prev => {
                const newErrors = { ...prev }
                if (error) {
                    newErrors[key] = error
                } else {
                    delete newErrors[key]
                }
                return newErrors
            })
        }
    }

    const handleAddToCart = () => {
        if (mode === 'size' && selectedVariant) {
            onAddToCart(product.id, selectedVariant)
            onClose()
        } else if (mode === 'custom') {
            // Validate all measurements
            const allErrors: Record<string, string> = {}
            measurementRules.forEach(rule => {
                const value = customMeasurements[rule.measurement_name]
                if (!value) {
                    allErrors[rule.measurement_name] = 'Required'
                } else {
                    const error = validateMeasurement(rule, value)
                    if (error) allErrors[rule.measurement_name] = error
                }
            })

            if (Object.keys(allErrors).length > 0) {
                setErrors(allErrors)
                return
            }

            onAddToCart(product.id, undefined, customMeasurements)
            onClose()
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-[85vh] sm:h-[90vh]">
                <SheetHeader>
                    <SheetTitle>{product.name}</SheetTitle>
                    <SheetDescription>
                        Choose your size or provide custom measurements
                    </SheetDescription>
                </SheetHeader>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="py-6">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as 'size' | 'custom')}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="size">Ready-Made Sizes</TabsTrigger>
                                <TabsTrigger value="custom">Custom Measurements</TabsTrigger>
                            </TabsList>

                            {/* Size Selection Tab */}
                            <TabsContent value="size" className="space-y-4">
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                                    {variants.map((variant) => (
                                        <Button
                                            key={variant.id}
                                            variant={selectedVariant === variant.id ? 'primary' : 'secondary'}
                                            className="h-16 text-lg font-semibold"
                                            onClick={() => setSelectedVariant(variant.id)}
                                        >
                                            {selectedVariant === variant.id && (<Check className="w-4 h-4 mr-1" />
                                            )}
                                            {variant.size}
                                        </Button>
                                    ))}
                                </div>

                                {variants.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">
                                        No standard sizes available. Please use custom measurements.
                                    </p>
                                )}
                            </TabsContent>

                            {/* Custom Measurements Tab */}
                            <TabsContent value="custom" className="space-y-4">
                                <div className="space-y-6 mt-4">
                                    {measurementRules.map((rule) => (
                                        <div key={rule.id} className="space-y-2">
                                            <Label htmlFor={rule.measurement_name} className="flex items-center gap-2">
                                                <Ruler className="w-4 h-4" />
                                                {rule.measurement_name} ({rule.unit})
                                            </Label>
                                            {rule.instruction && (
                                                <p className="text-xs text-gray-600">{rule.instruction}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    id={rule.measurement_name}
                                                    type="number"
                                                    placeholder={`${rule.min_value}-${rule.max_value}`}
                                                    value={customMeasurements[rule.measurement_name] || ''}
                                                    onChange={(e) => handleMeasurementChange(rule.measurement_name, e.target.value)}
                                                    className={errors[rule.measurement_name] ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            {errors[rule.measurement_name] && (
                                                <p className="text-xs text-red-600">{errors[rule.measurement_name]}</p>
                                            )}
                                        </div>
                                    ))}

                                    {measurementRules.length === 0 && (
                                        <p className="text-center text-gray-500 py-8">
                                            Custom measurements not available for this product.
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                <SheetFooter className="mt-6">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddToCart}
                        disabled={(mode === 'size' && !selectedVariant) || (mode === 'custom' && Object.keys(errors).length > 0)}
                        className="flex-1"
                    >
                        Add to Cart - ₹{product.price}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
