import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAttractionImage } from '@/services/unsplash';
import type { AttractionProps } from '@/types';

export default function AttractionCard({
  name,
  type,
  duration,
  description,
  rating,
  price,
  bestTime,
  tips,
  cityName
}: AttractionProps) {
  const [imageData, setImageData] = useState({
    url: '/placeholder-image.jpg',
    photographer: '',
    photographerUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const data = await getAttractionImage(name, cityName);
      setImageData(data);
      setLoading(false);
    };

    loadImage();
  }, [name, cityName]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-full w-full" />
        ) : (
          <>
            <Image
              src={imageData.url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            {imageData.photographer && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                Photo by{' '}
                <a
                  href={imageData.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {imageData.photographer}
                </a>{' '}
                on Unsplash
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{duration}</span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
}