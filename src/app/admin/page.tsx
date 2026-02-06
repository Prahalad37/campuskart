'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        totalRevenue: 0,
        activeSchools: 0,
        totalProducts: 0
    })

    useEffect(() => {
        // TODO: Fetch real stats from Supabase
        // For now, showing placeholder
        setStats({
            todayOrders: 0,
            totalRevenue: 0,
            activeSchools: 0,
            totalProducts: 0
        })
    }, [])

    const menuItems = [
        {
            title: 'Schools',
            href: '/admin/schools',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Manage all schools',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Classes',
            href: '/admin/classes',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            description: 'Manage classes',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Products',
            href: '/admin/products',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            description: 'Manage products',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Mappings',
            href: '/admin/mappings',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            description: 'Class-product mappings',
            color: 'from-amber-500 to-amber-600'
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            description: 'View & manage orders',
            color: 'from-pink-500 to-pink-600'
        }
    ]

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600">+0%</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">Orders Today</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.todayOrders}</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600">₹</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">Active</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">Schools</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.activeSchools}</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">Total</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">Products</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
            </div>

            {/* Dashboard Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Management</h2>
                <p className="text-slate-600">Quick access to platform modules</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="premium-card group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 text-white shadow-md`}>
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {item.description}
                                </p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
