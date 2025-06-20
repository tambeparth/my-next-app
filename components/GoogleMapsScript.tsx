"use client";

import Script from 'next/script';

const GoogleMapsScript = () => {
  // Add console log to debug API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log('Loading Google Maps with key:', apiKey?.substring(0, 4) + '...');

  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return null;
  }

  return (
    <Script
      id="google-maps-script"
      strategy="beforeInteractive"
      src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,maps,marker,geocoding`}
    />
  );
};

export default GoogleMapsScript;



