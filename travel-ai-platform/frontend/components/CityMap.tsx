"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiMapPin, FiLoader, FiAlertCircle } from 'react-icons/fi';

// Dynamically import React Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface CityMapProps {
  destination: string;
  className?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const CityMap = ({ destination, className = '' }: CityMapProps) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Geocode destination using free Nominatim API
  useEffect(() => {
    if (!destination) {
      setError('Please enter a destination');
      setIsLoading(false);
      return;
    }

    const geocodeDestination = async () => {
      try {
        setIsLoading(true);
        setError('');
        setCoordinates(null);

        // Use Nominatim (OpenStreetMap) for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error(`No locations found for "${destination}"`);
        }

        const location = data[0];
        setCoordinates({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
        });

      } catch (err) {
        console.error('Geocoding error:', err);
        setError(err instanceof Error ? err.message : 'Failed to find location');
      } finally {
        setIsLoading(false);
      }
    };

    geocodeDestination();
  }, [destination]);

  if (!isClient || isLoading) {
    return (
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <FiLoader className="animate-spin text-blue-500 text-2xl" />
          <p className="text-gray-600 font-medium">Locating {destination}...</p>
        </div>
        <div className="w-full h-full min-h-[300px] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <FiAlertCircle className="text-red-500 text-3xl" />
          <h3 className="text-lg font-medium text-gray-800">Map Error</h3>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Using free OpenStreetMap service. No API key required.
          </p>
        </div>
        <div className="w-full h-full min-h-[300px] bg-gray-200" />
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <FiLoader className="animate-spin text-blue-500 text-2xl" />
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
        <div className="w-full h-full min-h-[300px] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg border border-gray-200 ${className}`}>
      <div className="w-full h-full min-h-[300px]">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="text-center">
                <strong>{destination}</strong>
                <br />
                <small>Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 z-[1000]">
        <FiMapPin className="text-blue-500" />
        <span className="text-sm font-medium text-gray-700">{destination}</span>
      </div>
    </div>
  );
};

export default CityMap;
