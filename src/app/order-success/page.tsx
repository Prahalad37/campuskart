'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function OrderSuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')

    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your order. We&apos;ll process it shortly.
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="text-lg font-mono font-semibold text-gray-900">
                            {orderId.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                )}

                {/* Order Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                        📧 You will receive an order confirmation via SMS/email shortly.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Continue Shopping
                    </button>

                    <p className="text-sm text-gray-500">
                        Redirecting in {countdown} seconds...
                    </p>
                </div>

                {/* Support Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at{' '}
                        <a href="tel:+911234567890" className="text-blue-600 hover:underline">
                            +91 123 456 7890
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    )
}
