'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    type: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('campuskart_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('campuskart_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id)

            if (existingItem) {
                // Update quantity if item already in cart
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            // Add new item to cart
            return [...prevItems, { ...product, quantity }]
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const getCartTotal = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getCartCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
