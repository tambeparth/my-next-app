"use client";

import { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiLoader, FiAlertCircle, FiExternalLink, FiCreditCard } from 'react-icons/fi';

interface CityMapProps {
  destination: string;
  className?: string;
}

const CityMap = ({ destination, className = '' }: CityMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showBillingHelp, setShowBillingHelp] = useState(false);

  useEffect(() => {
    if (!destination) {
      setError('Please enter a destination');
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError('');
        setMapLoaded(false);
        setShowBillingHelp(false);

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key is not configured');
        }

        // Add error handling for invalid API key
        if (apiKey.startsWith('AIzaSy')) {
          console.warn('Using default Google Maps API key. Please replace with your own key.');
        }

        // Check if Google Maps script is loaded
        if (typeof window.google === 'undefined') {
          await loadGoogleMapsScript(apiKey);
        }

        const geocoder = new window.google.maps.Geocoder();

        const geocodeResult = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode(
            { address: destination },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              switch (status) {
                case google.maps.GeocoderStatus.OK:
                  if (results) resolve(results);
                  else reject(new Error('No results found'));
                  break;
                case google.maps.GeocoderStatus.REQUEST_DENIED:
                  setShowBillingHelp(true);
                  reject(new Error('Please check your Google Maps API key and ensure billing is enabled in Google Cloud Console'));
                  break;
                case google.maps.GeocoderStatus.ZERO_RESULTS:
                  reject(new Error(`No locations found for "${destination}"`));
                  break;
                case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                  reject(new Error('Daily quota exceeded. Please try again tomorrow.'));
                  break;
                default:
                  reject(new Error(`Geocoding failed: ${status}`));
              }
            }
          );
        });

        if (!geocodeResult[0]) {
          throw new Error('No results found');
        }

        const map = new window.google.maps.Map(mapRef.current!, {
          center: geocodeResult[0].geometry.location,
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: mapStyles,
          zoomControl: true,
          clickableIcons: true,
          gestureHandling: "greedy",
        });

        new window.google.maps.Marker({
          map,
          position: geocodeResult[0].geometry.location,
          title: destination,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
            )}`,
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32),
          },
        });

        setMapLoaded(true);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map');
      } finally {
        setIsLoading(false);
      }
    };

    const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });
    };

    initMap();

    return () => {
      // Cleanup function
      setShowBillingHelp(false);
    };
  }, [destination]);

  if (isLoading) {
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

          {(showBillingHelp || error.includes('billing')) && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg max-w-md">
              <div className="flex items-start gap-3">
                <FiCreditCard className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Billing Setup Required</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Google Maps requires billing to be enabled on your Google Cloud account.
                  </p>
                  <a
                    href="https://console.cloud.google.com/project/_/billing/enable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                  >
                    Enable billing now <FiExternalLink className="text-xs" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-full min-h-[300px] bg-gray-200" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg border border-gray-200 ${className}`}>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-10">
          <FiLoader className="animate-spin text-blue-500 text-2xl" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 z-10">
        <FiMapPin className="text-blue-500" />
        <span className="text-sm font-medium text-gray-700">{destination}</span>
      </div>
    </div>
  );
};

export default CityMap;

const mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#d1e0f0" }
    ]
  }
];
