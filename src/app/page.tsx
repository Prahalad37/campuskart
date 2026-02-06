"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { QRScanner } from "@/components/QRScanner";

export default function Home() {
    const router = useRouter();
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);

    const handleQRScan = (data: string) => {
        console.log("QR Code scanned:", data);
        setScanResult(data);

        // Parse the QR code data
        // Expected format: "https://campuskart.vercel.app/s/{school-slug}"
        // or just "{school-slug}"

        try {
            let schoolSlug = data;

            // If it's a full URL, extract the slug
            if (data.includes("/s/")) {
                const match = data.match(/\/s\/([^/?]+)/);
                if (match && match[1]) {
                    schoolSlug = match[1];
                }
            }

            // Navigate to school page
            router.push(`/s/${schoolSlug}`);
        } catch (error) {
            console.error("Error parsing QR code:", error);
            alert("Invalid QR code format. Please scan a valid school QR code.");
        }
    };

    const handleScanError = (error: Error) => {
        console.error("Scanner error:", error);
        setShowScanner(false);
        alert("Camera access failed. Please enable camera permissions or use demo mode.");
    };

    const handleDemoScan = () => {
        // Demo mode - navigate directly to DPS Rohini
        router.push("/s/dps-rohini");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-white">
                <div className="section-container">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Logo and Title */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elevated">
                                <span className="text-white font-bold text-4xl">CK</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                                Welcome to CampusKart
                            </h1>
                            <p className="text-lg text-secondary max-w-xl mx-auto">
                                Your trusted institutional shopping platform. Scan the QR code provided by your school to get started.
                            </p>
                        </div>

                        {/* QR Scanner Card */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-center">
                                    {showScanner ? "Point Camera at QR Code" : "Scan to Begin"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="py-8">
                                    {showScanner ? (
                                        <div className="max-w-md mx-auto">
                                            <QRScanner
                                                onScan={handleQRScan}
                                                onError={handleScanError}
                                            />
                                            <Button
                                                onClick={() => setShowScanner(false)}
                                                variant="outline"
                                                size="sm"
                                                className="mt-4"
                                            >
                                                Cancel Scan
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* QR Icon */}
                                            <div className="w-48 h-48 mx-auto mb-6 border-4 border-dashed border-primary rounded-xl flex items-center justify-center bg-gray-50">
                                                <svg className="w-24 h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                </svg>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button
                                                    onClick={() => setShowScanner(true)}
                                                    variant="primary"
                                                    size="lg"
                                                    className="min-w-[200px]"
                                                >
                                                    📷 Scan QR Code
                                                </Button>

                                                <Button
                                                    onClick={handleDemoScan}
                                                    variant="outline"
                                                    size="lg"
                                                    className="min-w-[200px]"
                                                >
                                                    Try Demo School
                                                </Button>
                                            </div>

                                            <p className="text-sm text-secondary mt-4">
                                                Use your phone camera to scan school QR codes or try the demo
                                            </p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Secure</h3>
                                <p className="text-sm text-secondary text-center">
                                    Your data is protected and encrypted
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Institutional</h3>
                                <p className="text-sm text-secondary text-center">
                                    Trusted by schools nationwide
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-primary">Convenient</h3>
                                <p className="text-sm text-secondary text-center">
                                    Easy ordering for all your needs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
