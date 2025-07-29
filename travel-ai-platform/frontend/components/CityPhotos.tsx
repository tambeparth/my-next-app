"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface CityPhotosProps {
  destination: string;
}

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = "https://api.unsplash.com";

// Custom loader function
const unsplashLoader = ({ src }: { src: string }) => {
  return src;
};

const CityPhotos = ({ destination }: CityPhotosProps) => {
  const [photos, setPhotos] = useState<
    Array<{
      url: string;
      photographer: string;
      photographerUrl: string;
    }>
  >([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Rest of your existing code...

  return (
    <div className="relative h-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhotoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          {photos[currentPhotoIndex] && (
            <>
              <Image
                loader={unsplashLoader}
                src={photos[currentPhotoIndex].url}
                alt={`${destination} photo ${currentPhotoIndex + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                Photo by{" "}
                <a
                  href={photos[currentPhotoIndex].photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {photos[currentPhotoIndex].photographer}
                </a>{" "}
                on Unsplash
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"
              }`}
            onClick={() => setCurrentPhotoIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CityPhotos;