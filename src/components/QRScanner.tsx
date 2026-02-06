"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (data: string) => void;
    onError: (error: Error) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanning, setScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    useEffect(() => {
        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        try {
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            await scanner.start(
                { facingMode: "environment" }, // Use back camera
                config,
                (decodedText) => {
                    console.log("QR Code scanned:", decodedText);
                    onScan(decodedText);
                    stopScanner(); // Stop after successful scan
                },
                (errorMessage) => {
                    // Ignore scanning errors (they happen continuously while searching)
                }
            );

            setScanning(true);
        } catch (err: any) {
            console.error("Failed to start scanner:", err);
            setCameraError(err.message || "Failed to access camera");
            onError(new Error("Cannot access camera. Please enable camera permissions."));
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && scanning) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    return (
        <div className="relative">
            {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl p-4 text-center">
                    <div>
                        <p className="text-red-600 font-medium mb-2">Camera Access Required</p>
                        <p className="text-sm text-red-500">{cameraError}</p>
                    </div>
                </div>
            )}

            <div id="qr-reader" className="rounded-xl overflow-hidden" />

            {scanning && !cameraError && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white bg-black/50 inline-block px-4 py-2 rounded-full text-sm">
                        📷 Point camera at QR code
                    </p>
                </div>
            )}
        </div>
    );
}
