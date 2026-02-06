import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CampusKart - Institutional Shopping Platform",
    description: "Secure and trusted shopping platform for educational institutions",
    manifest: "/manifest.json",
    themeColor: "#0B1F3A",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "CampusKart",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <CartProvider>{children}</CartProvider>
            </body>
        </html>
    );
}
