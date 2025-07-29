"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CityMap from '@/components/CityMap';

function MapViewPageContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination') || '';

    return (
        <div className="min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Map View: {destination}</h1>
            <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
                <CityMap destination={destination} />
            </div>
        </div>
    );
}

export default function MapViewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="text-xl">Loading map...</div>
            </div>
        }>
            <MapViewPageContent />
        </Suspense>
    );
}
