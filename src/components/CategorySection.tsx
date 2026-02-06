'use client'

import { Product, CATEGORY_CONFIG, getCategoryConfig } from '@/types/product'
import { ProductCard } from '@/components/ProductCard'

interface CategorySectionProps {
    category: string
    products: Product[]
    onAddToCart?: (product: Product) => void
    onCustomize?: (product: Product) => void
}

export function CategorySection({ category, products, onAddToCart, onCustomize }: CategorySectionProps) {
    if (products.length === 0) return null

    const config = getCategoryConfig(category)
    const isUniform = category === 'uniform'

    return (
        <section id={`category-${category}`} className="mb-12 scroll-mt-24">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{config.icon}</span>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {config.name}
                    </h2>
                    {config.description && (
                        <p className="text-sm text-gray-600">
                            {config.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Products Grid - Mobile Horizontal Scroll */}
            <div className="relative">
                {/* Mobile: Horizontal scroll */}
                <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-64 snap-center">
                            <ProductCard
                                product={product}
                                onAddToCart={onAddToCart}
                                onCustomize={onCustomize}
                                showCustomize={isUniform}
                            />
                        </div>
                    ))}
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            onCustomize={onCustomize}
                            showCustomize={isUniform}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
