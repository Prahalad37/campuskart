'use client'

import { BadgeCheck, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface VendorBadgeProps {
    isOfficial: boolean
    className?: string
}

export function VendorBadge({ isOfficial, className = '' }: VendorBadgeProps) {
    if (isOfficial) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold ${className}`}>
                            <BadgeCheck className="w-3 h-3" />
                            <span>Official</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs max-w-xs">
                            ✅ Authorized by School Administration<br />
                            Guaranteed adherence to uniform code
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold ${className}`}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Unverified</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs max-w-xs">
                        ⚠️ Third-party vendor<br />
                        Verification for school standards is pending
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
