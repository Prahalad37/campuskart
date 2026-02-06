'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

    const [formData, setFormData] = useState({
        parentName: '',
        phone: '',
        address: '',
        classId: ''
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (items.length === 0) {
            setError('Your cart is empty')
            return
        }

        if (!formData.parentName || !formData.phone || !formData.address) {
            setError('Please fill in all required fields')
            return
        }

        try {
            setSubmitting(true)

            const total = getCartTotal()

            const { data, error: insertError } = await supabase
                .from('orders')
                .insert([
                    {
                        parent_name: formData.parentName,
                        phone: formData.phone,
                        address: formData.address,
                        total: total,
                        status: 'new',
                        class_id: formData.classId || null
                    }
                ])
                .select()

            if (insertError) throw insertError

            clearCart()
            router.push(`/order-success?orderId=${data[0].id}`)

        } catch (err: any) {
            console.error('Error submitting order:', err)
            setError(err.message || 'Failed to submit order. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">Your Cart is Empty</h1>
                    <p className="text-slate-600 mb-8">Add some items to your cart to checkout</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md shadow-blue-500/20"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
                    <p className="text-slate-600">Complete your order details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">Order Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Parent/Guardian Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        placeholder="10-digit mobile number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Delivery Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                                        placeholder="Enter complete delivery address"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        `Place Order - ₹${getCartTotal()}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <Image
                                                src={item.image || '/placeholder-product.jpg'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-600 mt-1">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-blue-600 mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-semibold text-slate-900">₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-600">Delivery</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-semibold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{getCartTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
