'use client'

import { Product } from '@/types/product'
import { VendorBadge } from './VendorBadge'
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
    product: Product
    onAddToCart?: (product: Product) => void
    onCustomize?: (product: Product) => void
    showCustomize?: boolean
}

export function ProductCard({ product, onAddToCart, onCustomize, showCustomize = false }: ProductCardProps) {
    const isUniform = product.category === 'uniform'

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
            {/* Product Image with Badge */}
            <div className="relative aspect-square bg-gray-50">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-12 h-12" />
                    </div>
                )}

                {/* Vendor Badge - Positioned top-right */}
                <div className="absolute top-2 right-2">
                    <VendorBadge isOfficial={product.is_official_vendor} />
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-primary">
                        ₹{product.price.toFixed(2)}
                    </span>

                    {isUniform && showCustomize ? (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onCustomize?.(product)}
                            >
                                Customize
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => onAddToCart?.(product)}
                        >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
