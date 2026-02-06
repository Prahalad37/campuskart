import React from "react";
import Link from "next/link";

export function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="section-container py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-xl">CK</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-semibold text-primary">CampusKart</h1>
                            <p className="text-xs text-secondary">Institutional Platform</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <div className="trust-badge">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline text-sm">Secure Platform</span>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
