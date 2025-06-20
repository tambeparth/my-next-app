"use client";

import { useSearchParams } from 'next/navigation';
import CityMap from '@/components/CityMap';
import GoogleMapsScript from '@/components/GoogleMapsScript';

export default function MapViewPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination') || '';

    return (
        <div className="min-h-screen p-4">
            <GoogleMapsScript />
            <h1 className="text-2xl font-bold mb-4">Map View: {destination}</h1>
            <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
                <CityMap destination={destination} />
            </div>
        </div>
    );
}
