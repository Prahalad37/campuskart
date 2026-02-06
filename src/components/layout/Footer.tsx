import React from "react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-primary text-white mt-auto">
            <div className="section-container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">CampusKart</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Trusted institutional shopping platform for schools and educational institutions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>Email: support@campuskart.com</p>
                            <p>Phone: 1800-XXX-XXXX</p>
                            <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-primary-400">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
                        <p>&copy; 2024 CampusKart. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
