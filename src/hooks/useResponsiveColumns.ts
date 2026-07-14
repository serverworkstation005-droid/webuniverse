import React, { useEffect, useState } from 'react';

export function useResponsiveColumns(containerRef: React.RefObject<HTMLDivElement>) {
  const [columns, setColumns] = useState(6);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let timeoutId: number;

    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      
      timeoutId = window.setTimeout(() => {
        const { width, height } = entries[0].contentRect;
        
        setDimensions({ width, height });
        setIsReady(true);

        if (width < 500) setColumns(2);
        else if (width < 768) setColumns(3);
        else if (width < 1024) setColumns(4);
        else if (width < 1280) setColumns(5);
        else setColumns(6);
      }, 100); // 100ms debounce
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [containerRef]);
  
  return { columns, dimensions, isReady };
}
