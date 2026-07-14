import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const ImageWithSkeleton: React.FC<ImageProps> = ({ containerClassName = '', className = '', src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={BLUR_PLACEHOLDER}
        alt="placeholder"
        className={`absolute inset-0 w-full h-full object-cover blur-md transform scale-[1.02] transition-opacity duration-[950ms] ${isLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-[opacity,filter] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'} ${className}`}
        {...props}
      />
    </div>
  );
};
