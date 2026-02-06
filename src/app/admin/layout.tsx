"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem("admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "1234";

        if (password === adminPass) {
            sessionStorage.setItem("admin_auth", "true");
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Invalid password");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        setIsAuthenticated(false);
        setPassword("");
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">CK</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
                            <p className="text-slate-600 mt-2">Enter password to continue</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="premium-input"
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-red-600 text-sm mt-2">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="premium-button premium-button-primary w-full"
                            >
                                Access Admin Panel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: "Schools",
            href: "/admin/schools",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: "Classes",
            href: "/admin/classes",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            name: "Products",
            href: "/admin/products",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            name: "Mappings",
            href: "/admin/mappings",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside
                className={`sidebar fixed inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out z-30 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CK</span>
                            </div>
                            <span className="font-bold text-white">Admin</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-item ${isActive ? "sidebar-item-active" : ""
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="h-px bg-slate-800 mx-4"></div>

                    {/* Logout */}
                    <div className="p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all duration-150"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Premium Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-700 hover:text-slate-900"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-slate-900 hidden lg:block">
                        CampusKart Admin Panel
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">Admin User</span>
                    </div>
                </header>

                {/* Page content with fade-in */}
                <main className="p-4 lg:p-8 page-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
