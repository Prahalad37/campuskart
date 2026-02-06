'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface School {
    id: string
    name: string
    slug: string
    address?: string
    contact?: string
    email?: string
    logo_url?: string
    banner_url?: string
    slogan?: string
    highlights?: {
        achievements?: string[]
        specializations?: string[]
        established?: string
    }
    uniform_schedule?: {
        [key: string]: {
            type: string
            description: string
            icon: string
        }
    }
}

interface Class {
    id: string
    name: string
    school_id: string
}

interface UniformProduct {
    id: string
    name: string
    price: number
    image_url?: string
    description?: string
    category?: string
}

interface ProductBundle {
    id: string
    name: string
    description: string
    bundle_type: string
    discount_percent: number
    bundle_items?: {
        quantity: number
        products: {
            id: string
            name: string
            price: number
            image_url?: string
        }
    }[]
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SchoolPage({ params }: { params: { slug: string } }) {
    const router = useRouter()
    const [school, setSchool] = useState<School | null>(null)
    const [classes, setClasses] = useState<Class[]>([])
    const [bundles, setBundles] = useState<ProductBundle[]>([])
    const [uniformProducts, setUniformProducts] = useState<{ [key: string]: UniformProduct[] }>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDay, setSelectedDay] = useState('monday')
    const [addingToCart, setAddingToCart] = useState<string | null>(null)
    const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([])
    const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(null)

    useEffect(() => {
        fetchSchoolData()
        loadCart()
    }, [params.slug])

    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('campuskart_cart')
            if (savedCart) {
                setCart(JSON.parse(savedCart))
            }
        } catch (err) {
            console.error('Error loading cart:', err)
        }
    }

    const saveCart = (newCart: { productId: string, quantity: number }[]) => {
        try {
            localStorage.setItem('campuskart_cart', JSON.stringify(newCart))
            setCart(newCart)
        } catch (err) {
            console.error('Error saving cart:', err)
        }
    }

    const fetchSchoolData = async () => {
        try {
            // Fetch school with all branding info
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('slug', params.slug)
                .single()

            if (schoolError) throw schoolError

            if (!schoolData) {
                setError('School not found')
                setLoading(false)
                return
            }

            setSchool(schoolData)

            // Fetch classes
            const { data: classesData, error: classesError } = await supabase
                .from('classes')
                .select('*')
                .eq('school_id', schoolData.id)
                .order('name')

            if (classesError) throw classesError
            setClasses(classesData || [])

            // Fetch uniform products for each day
            const { data: uniformData, error: uniformError } = await supabase
                .from('uniform_products')
                .select(`
                    day_of_week,
                    display_order,
                    products (
                        id,
                        name,
                        price,
                        image_url,
                        description,
                        category
                    )
                `)
                .eq('school_id', schoolData.id)
                .order('display_order')

            if (uniformError) {
                console.error('Error fetching uniform products:', uniformError)
            } else {
                // Group products by day
                const productsByDay: { [key: string]: UniformProduct[] } = {}
                uniformData?.forEach((item: any) => {
                    if (!productsByDay[item.day_of_week]) {
                        productsByDay[item.day_of_week] = []
                    }
                    if (item.products) {
                        productsByDay[item.day_of_week].push(item.products)
                    }
                })
                setUniformProducts(productsByDay)
            }

            // Fetch product bundles with items
            const { data: bundlesData, error: bundlesError } = await supabase
                .from('product_bundles')
                .select(`
                    *,
                    bundle_items (
                        quantity,
                        products (
                            id,
                            name,
                            price,
                            image_url
                        )
                    )
                `)
                .eq('school_id', schoolData.id)

            if (bundlesError) console.error('Error fetching bundles:', bundlesError)
            setBundles(bundlesData || [])

        } catch (err: any) {
            console.error('Error fetching school:', err)
            setError('Failed to load school information. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = (productId: string, quantity: number = 1) => {
        setAddingToCart(productId)

        try {
            const existingItem = cart.find(item => item.productId === productId)
            let newCart

            if (existingItem) {
                newCart = cart.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                newCart = [...cart, { productId, quantity }]
            }

            saveCart(newCart)

            // Visual feedback
            setTimeout(() => setAddingToCart(null), 500)
        } catch (error) {
            console.error('Error adding to cart:', error)
            setAddingToCart(null)
        }
    }

    const handleAddCompleteSet = (products: UniformProduct[]) => {
        products.forEach(product => {
            handleAddToCart(product.id, 1)
        })
    }

    const handleAddBundleToCart = (bundle: ProductBundle) => {
        if (!bundle.bundle_items) return

        bundle.bundle_items.forEach(item => {
            handleAddToCart(item.products.id, item.quantity)
        })

        // Close modal after adding
        setSelectedBundle(null)
    }

    const handleClassClick = (classId: string) => {
        router.push(`/class/${classId}`)
    }

    const calculateBundlePrice = (bundle: ProductBundle) => {
        if (!bundle.bundle_items) return { original: 0, discounted: 0 }

        const original = bundle.bundle_items.reduce((sum, item) => {
            return sum + (item.products.price * item.quantity)
        }, 0)

        const discounted = original - (original * bundle.discount_percent / 100)
        return { original, discounted }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="animate-pulse space-y-8">
                        <div className="h-64 bg-slate-200 rounded-2xl"></div>
                        <div className="h-32 bg-slate-200 rounded-xl"></div>
                        <div className="h-48 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !school) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">School Not Found</h2>
                    <p className="text-slate-600">{error}</p>
                </div>
            </div>
        )
    }

    const uniformSchedule = school.uniform_schedule || {}
    const currentDayInfo = uniformSchedule[selectedDay]
    const currentDayProducts = uniformProducts[selectedDay] || []
    const totalDayPrice = currentDayProducts.reduce((sum, p) => sum + p.price, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section with Banner */}
            <div className="relative h-80 md:h-96 overflow-hidden">
                {school.banner_url ? (
                    <div className="absolute inset-0">
                        <img
                            src={school.banner_url}
                            alt={`${school.name} banner`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
                )}

                {/* Logo & School Info Overlay */}
                <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
                    {school.logo_url && (
                        <div className="mb-6 bg-white rounded-2xl p-4 shadow-2xl">
                            <img
                                src={school.logo_url}
                                alt={`${school.name} logo`}
                                className="w-24 h-24 object-contain"
                            />
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 drop-shadow-xl">
                        {school.name}
                    </h1>
                    {school.slogan && (
                        <p className="text-xl md:text-2xl text-center font-light drop-shadow-lg">
                            {school.slogan}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
                {/* School Highlights */}
                {school.highlights && (school.highlights.achievements || school.highlights.specializations) && (
                    <div className="premium-card">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🏆</span>
                            <h2 className="text-2xl font-bold text-slate-900">School Highlights</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Achievements */}
                            {school.highlights.achievements && school.highlights.achievements.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">Achievements</h3>
                                    <ul className="space-y-2">
                                        {school.highlights.achievements.map((achievement, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">✓</span>
                                                <span className="text-sm text-slate-700">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Specializations */}
                            {school.highlights.specializations && school.highlights.specializations.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">Specializations</h3>
                                    <ul className="space-y-2">
                                        {school.highlights.specializations.map((spec, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-1">★</span>
                                                <span className="text-sm text-slate-700">{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Established */}
                            {school.highlights.established && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">History</h3>
                                    <p className="text-3xl font-bold text-blue-600">{school.highlights.established}</p>
                                    <p className="text-sm text-slate-600 mt-1">Year Established</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Weekly Uniform Schedule with Products */}
                {uniformSchedule && Object.keys(uniformSchedule).length > 0 && (
                    <div className="premium-card">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">👔</span>
                            <h2 className="text-2xl font-bold text-slate-900">Weekly Uniform Schedule</h2>
                        </div>

                        {/* Day Selector */}
                        <div className="grid grid-cols-6 gap-2 mb-6">
                            {DAYS.map((day, idx) => {
                                const dayInfo = uniformSchedule[day]
                                if (!dayInfo) return null

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`p-4 rounded-xl text-center transition-all ${selectedDay === day
                                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{dayInfo.icon}</div>
                                        <div className="text-xs font-semibold">{DAY_LABELS[idx]}</div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Selected Day - Products or Description */}
                        {currentDayInfo && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">
                                    {currentDayInfo.type} Uniform
                                </h3>

                                {currentDayProducts.length > 0 ? (
                                    <>
                                        {/* Product Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {currentDayProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:scale-105"
                                                >
                                                    {/* Product Image */}
                                                    <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <span className="text-4xl">📦</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Name */}
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                                                        {product.name}
                                                    </h4>

                                                    {/* Price */}
                                                    <p className="text-lg font-bold text-blue-600 mb-3">
                                                        ₹{product.price.toLocaleString()}
                                                    </p>

                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => handleAddToCart(product.id)}
                                                        disabled={addingToCart === product.id}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                                    >
                                                        {addingToCart === product.id ? (
                                                            <span className="animate-spin">⏳</span>
                                                        ) : (
                                                            <>
                                                                <span>🛒</span>
                                                                <span>Add to Cart</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Complete Set Button */}
                                        {currentDayProducts.length > 1 && (
                                            <button
                                                onClick={() => handleAddCompleteSet(currentDayProducts)}
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
                                            >
                                                Add Complete Set to Cart - ₹{totalDayPrice.toLocaleString()}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <p className="text-slate-700">{currentDayInfo.description}</p>
                                        <p className="text-sm text-slate-500 mt-2 italic">Products coming soon...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Product Bundles */}
                {bundles.length > 0 && (
                    <div className="premium-card">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">📦</span>
                            <h2 className="text-2xl font-bold text-slate-900">Product Packages</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bundles.map((bundle) => {
                                const { original, discounted } = calculateBundlePrice(bundle)
                                const savings = original - discounted

                                return (
                                    <div key={bundle.id} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow relative">
                                        {/* Bundle Type Badge */}
                                        <div className="absolute top-4 right-4">
                                            {bundle.bundle_type === 'sports' && (
                                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                    ⚽ Sports
                                                </span>
                                            )}
                                            {bundle.bundle_type === 'premium' && (
                                                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                    ⭐ Premium
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount Badge */}
                                        {bundle.discount_percent > 0 && (
                                            <div className="absolute -top-3 -left-3 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                                                {bundle.discount_percent}% OFF
                                            </div>
                                        )}

                                        <h3 className="text-lg font-bold text-slate-900 mb-2 mt-2">
                                            {bundle.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4">{bundle.description}</p>

                                        {/* Bundle Items */}
                                        {bundle.bundle_items && bundle.bundle_items.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                <p className="text-xs font-semibold text-slate-600 uppercase">Includes:</p>
                                                {bundle.bundle_items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                                        <span className="text-blue-600">•</span>
                                                        <span>{item.quantity}x {item.products.name}</span>
                                                    </div>
                                                ))}
                                                {bundle.bundle_items.length > 3 && (
                                                    <p className="text-xs text-slate-500 italic">
                                                        +{bundle.bundle_items.length - 3} more items
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        <div className="border-t border-slate-200 pt-4 mt-4">
                                            {savings > 0 && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm text-slate-500 line-through">₹{original.toLocaleString()}</span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                        Save ₹{savings.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ₹{discounted.toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedBundle(bundle)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Classes Section */}
                <div className="premium-card">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Your Class</h2>

                    {classes.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">No classes available yet.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map((cls) => (
                                <button
                                    key={cls.id}
                                    onClick={() => handleClassClick(cls.id)}
                                    className="premium-card text-left group hover:scale-105 transition-transform"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {cls.name}
                                        </span>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Indicator (Fixed) */}
                {cart.length > 0 && (
                    <div className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-3 hover:bg-blue-700 transition-colors cursor-pointer">
                        <span className="text-2xl">🛒</span>
                        <span className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                    </div>
                )}

                {/* Bundle Detail Modal */}
                {selectedBundle && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedBundle(null)}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                                <h3 className="text-2xl font-bold text-slate-900">{selectedBundle.name}</h3>
                                <button
                                    onClick={() => setSelectedBundle(null)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6">
                                {/* Description */}
                                <p className="text-slate-600 mb-6">{selectedBundle.description}</p>

                                {/* Discount Badge */}
                                {selectedBundle.discount_percent > 0 && (
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full mb-6">
                                        <span className="text-2xl">🎉</span>
                                        <span className="font-bold">{selectedBundle.discount_percent}% OFF on Complete Set!</span>
                                    </div>
                                )}

                                {/* Products in Bundle */}
                                {selectedBundle.bundle_items && selectedBundle.bundle_items.length > 0 && (
                                    <div className="space-y-4 mb-6">
                                        <h4 className="text-lg font-semibold text-slate-900">Included Items:</h4>
                                        <div className="space-y-3">
                                            {selectedBundle.bundle_items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                                                    {/* Product Image */}
                                                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                                        {item.products.image_url ? (
                                                            <img
                                                                src={item.products.image_url}
                                                                alt={item.products.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <span className="text-2xl">📦</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-slate-900">{item.products.name}</h5>
                                                        <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                                    </div>

                                                    {/* Product Price */}
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-900">₹{item.products.price.toLocaleString()}</p>
                                                        <p className="text-xs text-slate-500">each</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pricing Summary */}
                                {(() => {
                                    const { original, discounted } = calculateBundlePrice(selectedBundle)
                                    const savings = original - discounted
                                    return (
                                        <div className="border-t border-slate-200 pt-6 space-y-3">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span>Original Price:</span>
                                                <span className="line-through">₹{original.toLocaleString()}</span>
                                            </div>
                                            {savings > 0 && (
                                                <div className="flex items-center justify-between text-green-600 font-semibold">
                                                    <span>You Save:</span>
                                                    <span>₹{savings.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between text-2xl font-bold text-blue-600 pt-2 border-t border-slate-200">
                                                <span>Bundle Price:</span>
                                                <span>₹{discounted.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-6 py-4 border-t border-slate-200">
                                <button
                                    onClick={() => handleAddBundleToCart(selectedBundle)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                >
                                    <span className="text-2xl">🛒</span>
                                    <span>Add Complete Bundle to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
