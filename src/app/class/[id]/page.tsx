'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    price: number
    type: string
    image: string
}

interface ClassData {
    id: string
    name: string
    school: {
        name: string
    }
}

export default function ClassProductsPage() {
    const params = useParams()
    const router = useRouter()
    const { addToCart, getCartCount } = useCart()
    const classId = params.id as string

    const [classData, setClassData] = useState<ClassData | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [quantities, setQuantities] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchClassAndProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId])

    async function fetchClassAndProducts() {
        try {
            setLoading(true)

            const { data: classInfo, error: classError } = await supabase
                .from('classes')
                .select(`
                    id,
                    name,
                    schools!inner (
                        name
                    )
                `)
                .eq('id', classId)
                .single()

            if (classError) throw classError

            const schoolData: any = classInfo?.schools
            const schoolName = schoolData?.name || 'Unknown School'

            setClassData({
                id: classInfo.id,
                name: classInfo.name,
                school: { name: schoolName }
            })

            const { data: classProducts, error: productsError } = await supabase
                .from('class_products')
                .select('products(*)')
                .eq('class_id', classId)

            if (productsError) throw productsError

            const productsList: Product[] = classProducts
                .map((cp: any) => cp.products)
                .filter((p: any) => p && p.id)

            setProducts(productsList)

            const initialQuantities: Record<string, number> = {}
            productsList.forEach(p => {
                initialQuantities[p.id] = 1
            })
            setQuantities(initialQuantities)

        } catch (err: any) {
            setError(err.message || 'Failed to load products')
            console.error('Error fetching class products:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = (productId: string, change: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }))
    }

    const handleAddToCart = (product: Product) => {
        const quantity = quantities[product.id] || 1
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                type: product.type
            },
            quantity
        )
        alert(`Added ${quantity}x ${product.name} to cart!`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Skeleton Header */}
                <div className="bg-white border-b border-slate-200 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-6 bg-slate-200 rounded w-40 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-slate-100 rounded w-32 animate-pulse"></div>
                            </div>
                            <div className="h-10 bg-slate-200 rounded-lg w-28 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Skeleton Products */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                                <div className="h-48 bg-slate-200 animate-pulse"></div>
                                <div className="p-6">
                                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
                                    <div className="h-7 bg-slate-200 rounded w-24 mb-4 animate-pulse"></div>
                                    <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">Error</h1>
                    <p className="text-slate-600 mb-8">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">{classData?.name}</h1>
                            <p className="text-sm text-slate-600">{classData?.school.name}</p>
                        </div>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md shadow-blue-500/20"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Cart ({getCartCount()})
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-slate-600 text-lg font-medium">No products available for this class yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-blue-200"
                            >
                                {/* Product Image */}
                                <div className="relative h-52 bg-slate-100">
                                    <Image
                                        src={product.image || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 shadow-sm capitalize">
                                            {product.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-lg">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-5">
                                        <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-slate-700">Quantity:</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(product.id, -1)}
                                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors duration-150"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-10 text-center font-semibold text-slate-900">
                                                {quantities[product.id] || 1}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors duration-150"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm shadow-blue-500/20"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
