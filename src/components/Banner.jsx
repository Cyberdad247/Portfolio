import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';

interface BannerProps {
  src: string;
  alt: string;
}

const Banner = ({ src, alt }: BannerProps) => {
  const [setRef, style] = useFadeIn();
  return (
    <div ref={setRef} style={style} className="banner-container bg-[--section-odd-bg] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <img
          src={src || "https://placehold.co/1200x350/777777/ffffff/png?text=About+Us+Banner+(Placeholder)"}
          alt={alt || "Banner Image"}
          className="w-full max-w-5xl mx-auto rounded-lg shadow-lg object-cover h-64 md:h-80 border border-[--image-border-color]"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x350/cccccc/666666?text=Image+Not+Available'; }}
        />
      </div>
    </div>
  );
};



export default Banner;