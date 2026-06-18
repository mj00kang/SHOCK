import React, { useState, useEffect } from 'react';
import ProductImage from './ProductImage';

interface ProductGalleryProps {
  image: string;
  images?: string[];
  title: string;
  categoryGroup: 'POP' | 'SPORTS' | 'ANALOG';
  categoryName: string;
}

export default function ProductGallery({
  image,
  images = [],
  title,
  categoryGroup,
  categoryName
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(image);

  // Synchronise if primary image changes
  useEffect(() => {
    setActiveImage(image);
  }, [image]);

  const allImages = images && images.length > 0 ? images : [image];

  return (
    <div className="space-y-4 text-left" id="gallery-container">
      {/* Primary Display Frame */}
      <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group/main">
        <ProductImage 
          src={activeImage} 
          alt={title}
          categoryGroup={categoryGroup}
          categoryName={categoryName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.015]"
        />
        
        {/* Hover watermark overlay */}
        <div className="absolute inset-x-0 bottom-0  from-black/25 via-transparent to-transparent p-4 opacity-0 group-hover/main:opacity-100 transition-opacity">
          <p className="text-white text-[10px] font-sans font-bold">샥 CERTIFIED ORIGINAL COLLECTION</p>
        </div>
      </div>

      {/* Multi Thumbnails Grid */}
      {allImages.length > 1 && (
        <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-thin">
          {allImages.map((imgUrl, index) => {
            const isSelected = activeImage === imgUrl;
            return (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`cursor-pointer h-16 w-16 rounded-xl overflow-hidden border bg-white transition-all duration-200 flex-shrink-0 ${
                  isSelected 
                    ? 'border-gray-800 ring-2 ring-gray-200 scale-95 shadow-sm' 
                    : 'border-gray-200 hover:border-slate-350 hover:scale-95'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`${title} thumbnail ${index + 1}`} 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
